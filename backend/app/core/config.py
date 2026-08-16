import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hackathon AI Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "super_secret_hackathon_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./hackathon.db"
    
    # RAG Settings
    CHUNK_SIZE: int = 500  # words
    CHUNK_OVERLAP: int = 100  # words
    EMBEDDING_DIM: int = 128
    DEFAULT_TOP_K: int = 4
    
    # ElevenLabs Settings
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "JBFqnCBsd6RMkjVDRZzb"
    ELEVENLABS_MODEL_ID: str = "eleven_multilingual_v2"

    # AI Service URL (points to the deployed python AI microservice)
    AI_SERVICE_URL: str = "http://localhost:8001"

    # CORS — comma-separated list of allowed origins via env, fallback to localhost for dev
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    def get_cors_origins(self) -> list[str]:
        """Return CORS origins, merging env FRONTEND_URL if provided."""
        origins = list(self.BACKEND_CORS_ORIGINS)
        frontend_url = os.getenv("FRONTEND_URL", "")
        if frontend_url and frontend_url not in origins:
            origins.append(frontend_url)
        return origins

    class Config:
        case_sensitive = True
        extra = "ignore"
        env_file = ".env"

settings = Settings()

