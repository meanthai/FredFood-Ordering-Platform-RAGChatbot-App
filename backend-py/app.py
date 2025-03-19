from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional
from apscheduler.schedulers.background import BackgroundScheduler

# Import necessary functions
from model.model import chatbot_initialization, embedding_rerank_model_initialization, qdrant_db_initialization
from controller.controller import cleanup_inactive_user
from route.route import router

class PromptData(BaseModel):
    prompt: Optional[str] = None
    userId: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.include_router(router)

scheduler = BackgroundScheduler()
scheduler.add_job(cleanup_inactive_user, "interval", minutes=10)  # Run every 10 minutes
scheduler.start()

if __name__ == '__main__':
    try:
        qdrant_client = qdrant_db_initialization()
        print("Successfully initialized the Qdrant client!")

        chatbot_client, initial_chat_engine = chatbot_initialization()
        print("Successfully initialized the ChatGPT model!")

        embed_model, reranker = embedding_rerank_model_initialization()
        print("Successfully initialized the embedding model and the reranker!")

        app.state.qdrant_client = qdrant_client
        app.state.chatbot_client = chatbot_client
        app.state.initial_chat_engine = initial_chat_engine
        app.state.embed_model = embed_model
        app.state.reranker = reranker

    except Exception as e:
        print(f"Error during initialization: {e}")
        raise e

    try:
        uvicorn.run(app, host="0.0.0.0", port=8053)
        print("Successfully initialized the FastAPI application")
    except Exception as e:
        print(f"Error with FastAPI app initialization: {e}")
