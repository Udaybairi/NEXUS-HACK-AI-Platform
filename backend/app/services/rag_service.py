import json
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.all_models import ChatSession, ChatMessage, User
from app.rag.retriever import hybrid_retrieve_chunks
from app.rag.reranker import rerank_and_filter_chunks
from app.rag.prompt import generate_rag_answer

def get_or_create_session(db: Session, session_id: Optional[str] = None, user_id: Optional[str] = None) -> ChatSession:
    if session_id:
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            return session

    session = ChatSession(
        user_id=user_id,
        title="Hackathon AI Consultation"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def process_chat_query(db: Session, query: str, session_id: Optional[str] = None, user_id: Optional[str] = None) -> Dict[str, Any]:
    session = get_or_create_session(db, session_id, user_id)

    # Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=query
    )
    db.add(user_msg)
    db.commit()

    import requests, os
    
    # RAG Retrieval Flow
    # Forward the request to the new Python AI service
    ai_service_url = os.getenv("AI_SERVICE_URL", "http://localhost:8001") + "/chat"
    try:
        response = requests.post(ai_service_url, json={"message": query, "session_id": session.id})
        response.raise_for_status()
        ai_data = response.json()
        answer_text = ai_data.get("answer", "")
        sources = ai_data.get("sources", [])
    except Exception as e:
        answer_text = f"Error connecting to AI service: {str(e)}"
        sources = []


    # Save assistant message
    asst_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=answer_text,
        sources_json=json.dumps(sources)
    )
    db.add(asst_msg)
    db.commit()

    return {
        "answer": answer_text,
        "sources": sources,
        "session_id": session.id
    }

async def stream_chat_tokens(db: Session, query: str, session_id: Optional[str] = None, user_id: Optional[str] = None) -> AsyncGenerator[str, None]:
    result = process_chat_query(db, query, session_id, user_id)
    answer = result["answer"]
    sources = result["sources"]
    sess_id = result["session_id"]

    # First send session and sources metadata
    meta = {
        "type": "metadata",
        "session_id": sess_id,
        "sources": sources
    }
    yield f"data: {json.dumps(meta)}\n\n"
    await asyncio.sleep(0.05)

    # Stream text tokens word by word for real-time AI effect
    words = answer.split(" ")
    for word in words:
        chunk_data = {
            "type": "token",
            "content": word + " "
        }
        yield f"data: {json.dumps(chunk_data)}\n\n"
        await asyncio.sleep(0.02)

    # Final event
    yield "data: [DONE]\n\n"
