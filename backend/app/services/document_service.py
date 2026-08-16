from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import Document, DocumentChunk
from app.rag.loader import extract_text_from_file
from app.rag.chunker import create_overlapping_chunks
from app.rag.embedder import generate_embedding, serialize_embedding

def process_and_index_document(
    db: Session, 
    file_bytes: bytes, 
    filename: str
) -> Document:
    """
    Ingestion pipeline:
    1. Text extraction
    2. Chunking with overlap
    3. Vector embedding generation
    4. Database indexing
    """
    # 1. Extract text
    pages_data = extract_text_from_file(file_bytes, filename)
    file_type = filename.split(".")[-1].upper() if "." in filename else "TXT"

    # 2. Create chunks
    chunks_meta = create_overlapping_chunks(
        pages_data=pages_data, 
        document_name=filename, 
        chunk_size_words=100, 
        overlap_words=20
    )

    # 3. Create Document record
    doc = Document(
        name=filename,
        file_type=file_type,
        file_size=len(file_bytes),
        chunk_count=len(chunks_meta)
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # 4. Generate embeddings and save chunks
    db_chunks = []
    for chunk_info in chunks_meta:
        vector = generate_embedding(chunk_info["content"])
        chunk_obj = DocumentChunk(
            document_id=doc.id,
            content=chunk_info["content"],
            page_number=chunk_info["page_number"],
            chunk_index=chunk_info["chunk_index"],
            embedding_json=serialize_embedding(vector)
        )
        db_chunks.append(chunk_obj)

    db.add_all(db_chunks)
    db.commit()
    db.refresh(doc)

    return doc

def delete_document(db: Session, doc_id: str) -> bool:
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        return False
    db.delete(doc)
    db.commit()
    return True
