from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Document, DocumentChunk
from app.schemas.all_schemas import DocumentOut, ChunkOut
from app.services.document_service import process_and_index_document, delete_document
from app.rag.retriever import hybrid_retrieve_chunks
from app.rag.reranker import rerank_and_filter_chunks

router = APIRouter(prefix="/documents", tags=["Documents & RAG Admin"])

@router.post("/upload", response_model=DocumentOut)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc", "txt", "md"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Allowed: .pdf, .docx, .txt, .md")

    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    doc = process_and_index_document(db, content_bytes, file.filename)
    return DocumentOut.model_validate(doc)

@router.get("", response_model=List[DocumentOut])
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [DocumentOut.model_validate(d) for d in docs]

@router.delete("/{document_id}")
def remove_document(document_id: str, db: Session = Depends(get_db)):
    success = delete_document(db, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}

@router.post("/{document_id}/reindex")
def reindex_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Re-calculate embeddings for doc chunks
    for chunk in doc.chunks:
        vec = generate_embedding(chunk.content)
        chunk.embedding_json = serialize_embedding(vec)
    
    db.commit()
    return {
        "status": "success",
        "message": f"Document '{doc.name}' re-indexed successfully",
        "chunk_count": doc.chunk_count
    }

@router.post("/test-search")

def test_rag_search(query: str, top_k: int = 5, db: Session = Depends(get_db)):
    raw_chunks = hybrid_retrieve_chunks(db, query, top_k=top_k, min_score=0.05)
    reranked = rerank_and_filter_chunks(raw_chunks, top_k=top_k)
    return {
        "query": query,
        "retrieved_count": len(reranked),
        "results": reranked
    }
