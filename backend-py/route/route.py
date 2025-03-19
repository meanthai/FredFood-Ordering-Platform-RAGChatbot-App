from fastapi import FastAPI, HTTPException, APIRouter, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
# ----------------------------------------------------------
from controller.controller import answer_prompt

class PromptData(BaseModel):
    prompt: Optional[str] = None
    userId: str

router = APIRouter()

def get_objects(request: Request):
    return {
        "embed_model": request.app.state.embed_model,
        "reranker": request.app.state.reranker,
        "qdrant_client": request.app.state.qdrant_client,
        "chatbot_client": request.app.state.chatbot_client,
        "initial_chat_engine": request.app.state.initial_chat_engine,
    }

@router.post("/api/chatbot/response")
def chatbot_response(input_data: PromptData, objects=Depends(get_objects)):
    print("Prompt data:", input_data)

    embed_model = objects["embed_model"]
    reranker = objects["reranker"]
    qdrant_client = objects["qdrant_client"]
    chatbot_client = objects["chatbot_client"]
    initial_chat_engine = objects["initial_chat_engine"]

    return answer_prompt(input_data.prompt, input_data.userId, embed_model, reranker, qdrant_client, chatbot_client, initial_chat_engine)