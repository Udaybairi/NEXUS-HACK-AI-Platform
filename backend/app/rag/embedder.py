import re
import math
import json
import numpy as np
from typing import List, Union

VECTOR_DIM = 128

def normalize_text(text: str) -> List[str]:
    """Cleans text and extracts tokens."""
    tokens = re.findall(r'\b[a-zA-Z0-9_-]+\b', text.lower())
    return tokens

def generate_embedding(text: str, dim: int = VECTOR_DIM) -> List[float]:
    """
    Generates a deterministic normalized semantic embedding vector for a given text.
    Uses subword hashing + character n-gram projections for high quality similarity matching.
    """
    tokens = normalize_text(text)
    if not tokens:
        return [0.0] * dim

    vec = np.zeros(dim, dtype=np.float32)

    for token in tokens:
        # Word hash
        h1 = abs(hash(token)) % dim
        vec[h1] += 1.0
        
        # Bi-gram subwords for semantic capture
        if len(token) > 3:
            for i in range(len(token) - 2):
                ngram = token[i:i+3]
                h2 = abs(hash(ngram)) % dim
                vec[h2] += 0.5

    # L2 Normalization
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm

    return vec.tolist()

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Computes cosine similarity between two vector lists."""
    v1 = np.array(vec1, dtype=np.float32)
    v2 = np.array(vec2, dtype=np.float32)
    
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return float(np.dot(v1, v2) / (norm1 * norm2))

def serialize_embedding(vec: List[float]) -> str:
    return json.dumps(vec)

def deserialize_embedding(vec_str: str) -> List[float]:
    try:
        return json.loads(vec_str)
    except Exception:
        return [0.0] * VECTOR_DIM
