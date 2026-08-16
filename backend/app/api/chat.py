import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import ChatRequest, ChatResponse, ChatMessageOut, SourceCitation
from app.services.rag_service import process_chat_query, stream_chat_tokens
from app.models.all_models import ChatMessage, ChatSession, User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("", response_model=ChatResponse)
def ask_chat(req: ChatRequest, db: Session = Depends(get_db)):
    if not req.message or len(req.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    res = process_chat_query(db, req.message, req.session_id)
    return ChatResponse(
        answer=res["answer"],
        sources=[SourceCitation(**s) for s in res["sources"]],
        session_id=res["session_id"]
    )

@router.get("/stream")
async def stream_chat(message: str, session_id: Optional[str] = None, db: Session = Depends(get_db)):
    if not message or len(message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message parameter is required")

    return StreamingResponse(
        stream_chat_tokens(db, message, session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/history/{session_id}", response_model=List[ChatMessageOut])
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    out = []
    for msg in messages:
        sources = []
        if msg.sources_json:
            try:
                sources = [SourceCitation(**s) for s in json.loads(msg.sources_json)]
            except Exception:
                sources = []
        out.append(ChatMessageOut(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            sources=sources,
            created_at=msg.created_at
        ))

    return out
