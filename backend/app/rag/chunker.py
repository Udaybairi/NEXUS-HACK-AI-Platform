from typing import List, Dict, Any

def create_overlapping_chunks(
    pages_data: List[Dict[str, Any]], 
    document_name: str,
    chunk_size_words: int = 300, 
    overlap_words: int = 50
) -> List[Dict[str, Any]]:
    """
    Splits text from pages into overlapping chunks with metadata.
    """
    chunks = []
    global_chunk_idx = 0

    for page_info in pages_data:
        page_num = page_info["page"]
        text = page_info["text"]
        words = text.split()

        if not words:
            continue

        if len(words) <= chunk_size_words:
            chunks.append({
                "chunk_index": global_chunk_idx,
                "document_name": document_name,
                "page_number": page_num,
                "content": text,
                "word_count": len(words)
            })
            global_chunk_idx += 1
        else:
            step = chunk_size_words - overlap_words
            if step <= 0:
                step = chunk_size_words // 2

            for start_idx in range(0, len(words), step):
                chunk_words = words[start_idx : start_idx + chunk_size_words]
                if not chunk_words:
                    continue

                chunk_text = " ".join(chunk_words)
                chunks.append({
                    "chunk_index": global_chunk_idx,
                    "document_name": document_name,
                    "page_number": page_num,
                    "content": chunk_text,
                    "word_count": len(chunk_words)
                })
                global_chunk_idx += 1

                if start_idx + chunk_size_words >= len(words):
                    break

    return chunks
