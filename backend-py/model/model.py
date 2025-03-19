import google.generativeai as genai
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, CrossEncoder
from qdrant_client import QdrantClient
from google import genai

def chatbot_initialization():
    load_dotenv()
    client = genai.Client()
    chat = client.chats.create(model="gemini-1.5-flash")
    return client, chat

def embedding_rerank_model_initialization():
    embed_model = SentenceTransformer('BAAI/bge-m3')
    reranker = CrossEncoder("BAAI/bge-reranker-base")

    return embed_model, reranker

def qdrant_db_initialization():
    client = QdrantClient(url="172.17.0.3:6333")
    
    return client
