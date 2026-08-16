import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_community.document_loaders import TextLoader
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

print("RAG system starting...")

# ============================================================
# 2. FIND THE HACKATHON DOCUMENT
# ============================================================

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "rulebook.txt"

print(f"Looking for document at: {DATA_PATH}")

# ============================================================
# 3. LOAD THE TEXT DOCUMENT
# ============================================================

def load_hackathon_data():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"\nHackathon document not found!\n"
            f"Expected location:\n{DATA_PATH}\n"
        )
    loader = TextLoader(str(DATA_PATH), encoding="utf-8")
    documents = loader.load()
    print(f"Successfully loaded {len(documents)} document(s)")
    return documents

# ============================================================
# 4. SPLIT DOCUMENT INTO CHUNKS
# ============================================================

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150
    )
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")
    return chunks

# ============================================================
# 5. INITIALIZE VECTOR STORE
# ============================================================

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
vector_store = InMemoryVectorStore(embeddings)

def init_vector_store():
    documents = load_hackathon_data()
    chunks = split_documents(documents)
    vector_store.add_documents(chunks)
    print("Successfully added chunks to vector store")

# Initialize it on import
init_vector_store()

# ============================================================
# 6. EXPORT RETRIEVER
# ============================================================
def get_retriever():
    return vector_store.as_retriever(search_kwargs={"k": 4})