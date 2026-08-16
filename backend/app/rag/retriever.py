import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import DocumentChunk, Document
from app.rag.embedder import generate_embedding, cosine_similarity, deserialize_embedding, normalize_text

def hybrid_retrieve_chunks(
    db: Session, 
    query: str, 
    top_k: int = 5,
    min_score: float = 0.15
) -> List[Dict[str, Any]]:
    """
    Performs hybrid retrieval (semantic vector search + BM25 keyword matching)
    over indexed document chunks in the database.
    """
    query_vector = generate_embedding(query)
    query_tokens = set(normalize_text(query))

    chunks_query = db.query(DocumentChunk, Document.name.label("doc_name")).join(
        Document, DocumentChunk.document_id == Document.id
    ).all()

    scored_results = []

    for chunk, doc_name in chunks_query:
        chunk_vector = deserialize_embedding(chunk.embedding_json)
        vector_sim = cosine_similarity(query_vector, chunk_vector)

        # Keyword match overlap score
        chunk_tokens = set(normalize_text(chunk.content))
        if query_tokens:
            keyword_overlap = len(query_tokens.intersection(chunk_tokens)) / len(query_tokens)
        else:
            keyword_overlap = 0.0

        # Hybrid weighting score
        hybrid_score = (vector_sim * 0.65) + (keyword_overlap * 0.35)

        if hybrid_score >= min_score or (query_tokens and len(query_tokens.intersection(chunk_tokens)) >= 2):
            scored_results.append({
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "document_name": doc_name,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "score": round(float(hybrid_score), 4),
                "vector_sim": round(float(vector_sim), 4),
                "keyword_score": round(float(keyword_overlap), 4)
            })

    # Sort descending by hybrid score
    scored_results.sort(key=lambda x: x["score"], reverse=True)
    return scored_results[:top_k]
