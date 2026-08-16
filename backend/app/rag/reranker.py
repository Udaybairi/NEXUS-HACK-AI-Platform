from typing import List, Dict, Any

def rerank_and_filter_chunks(chunks: List[Dict[str, Any]], top_k: int = 4) -> List[Dict[str, Any]]:
    """
    Reranks chunks, eliminates redundant duplicate text, and enforces top-k ceiling.
    """
    if not chunks:
        return []

    seen_snippets = set()
    filtered = []

    for item in chunks:
        # Deduplicate very similar content
        snippet_key = item["content"][:80].lower()
        if snippet_key in seen_snippets:
            continue
        seen_snippets.add(snippet_key)
        filtered.append(item)

        if len(filtered) >= top_k:
            break

    return filtered
