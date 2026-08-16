import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.rag.chunker import create_overlapping_chunks
from app.rag.embedder import generate_embedding, cosine_similarity

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test.db"):
        try:
            os.remove("./test.db")
        except Exception:
            pass

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Hackathon" in response.json()["message"]

def test_user_registration_and_login():
    reg_payload = {
        "name": "Test Developer",
        "email": "test@hackathon.org",
        "password": "secretpassword123",
        "role": "USER"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@hackathon.org"

    login_payload = {
        "email": "test@hackathon.org",
        "password": "secretpassword123"
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()

def test_rag_chunker_overlap():
    pages = [{"page": 1, "text": "word " * 600}]
    chunks = create_overlapping_chunks(pages, "test.txt", chunk_size_words=300, overlap_words=50)
    assert len(chunks) >= 2
    assert chunks[0]["page_number"] == 1

def test_embedding_cosine_similarity():
    vec1 = generate_embedding("hackathon submission deadline and rules")
    vec2 = generate_embedding("submission hard deadline for projects")
    vec3 = generate_embedding("chocolate birthday cake recipe")

    sim12 = cosine_similarity(vec1, vec2)
    sim13 = cosine_similarity(vec1, vec3)

    assert sim12 > sim13
