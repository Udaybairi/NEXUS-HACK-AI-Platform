from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

from app.rag import get_retriever
from google import genai

app = FastAPI(title="Hackathon AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    session_id: Optional[str] = None
    sources: list = []

# Initialize retriever and Gemini client once at startup
retriever = get_retriever()
gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

SYSTEM_PROMPT = """You are a helpful AI chatbot assistant for the Innovate AI Hackathon website.
Your job is to answer participant questions about rules, eligibility, registration, schedule, venue,
food, accommodation, judging criteria, submissions, prizes, teams, deadlines, and logistics.

Answer ONLY based on the context provided below. Be concise and direct.
If the answer is NOT in the context, respond with:
"I couldn't find that information in the official hackathon information. Please contact the organizing team for confirmation."

Do NOT make up any information not present in the context."""

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message or len(req.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        # Step 1: Retrieve relevant chunks
        docs = retriever.invoke(req.message)
        context = "\n\n".join([doc.page_content for doc in docs])

        # Step 2: Build prompt with context
        prompt = f"""{SYSTEM_PROMPT}

--- OFFICIAL HACKATHON CONTEXT ---
{context}
--- END OF CONTEXT ---

Participant Question: {req.message}

Answer:"""

        # Step 3: Call Gemini directly (single LLM call — fast!)
        response = gemini_client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
        )
        answer = response.text.strip()

        return ChatResponse(
            answer=answer,
            session_id=req.session_id,
            sources=[]
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "AI Service is running"}
