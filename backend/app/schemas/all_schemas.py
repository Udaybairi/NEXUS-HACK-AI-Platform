from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "USER"
    dietary_preference: Optional[str] = "No Preference"
    attendance_mode: Optional[str] = "In-Person"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    dietary_preference: Optional[str] = "No Preference"
    attendance_mode: Optional[str] = "In-Person"
    team_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Team Schemas
class TeamCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    track: Optional[str] = "General AI"

class TeamMemberAdd(BaseModel):
    email: EmailStr

class TeamOut(BaseModel):
    id: str
    name: str
    code: str
    track: str
    leader_id: str
    created_at: datetime
    members: List[UserOut] = []

    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=10)
    track: str
    tech_stack: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    track: Optional[str] = None
    tech_stack: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectOut(BaseModel):
    id: str
    team_id: str
    title: str
    description: str
    track: str
    tech_stack: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    status: str
    score: Optional[float] = None
    feedback: Optional[str] = None
    judge_score: Optional[float] = None
    judge_rubric_json: Optional[str] = None
    created_at: datetime
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JudgeScoreRequest(BaseModel):
    technical_execution: float = Field(..., ge=0, le=30)
    innovation: float = Field(..., ge=0, le=30)
    design: float = Field(..., ge=0, le=20)
    impact: float = Field(..., ge=0, le=20)
    feedback: Optional[str] = None

class SubmissionOut(BaseModel):
    id: str
    project_id: str
    submitted_at: datetime
    score: Optional[float] = None
    status: str

    class Config:
        from_attributes = True

# Document & RAG Schemas
class DocumentOut(BaseModel):
    id: str
    name: str
    file_type: str
    file_size: int
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChunkOut(BaseModel):
    id: str
    document_id: str
    content: str
    page_number: int
    chunk_index: int
    score: Optional[float] = None

# Chat Schemas
class SourceCitation(BaseModel):
    document: str
    page: int
    chunk_index: int
    snippet: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation] = []
    session_id: str

class ChatMessageOut(BaseModel):
    id: str
    role: str
    content: str
    sources: List[SourceCitation] = []
    created_at: datetime

class ChatSessionOut(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: List[ChatMessageOut] = []

# AI Assistant Features
class AIProjectIdeaRequest(BaseModel):
    idea: str
    track: str

class AIProjectIdeaResponse(BaseModel):
    problem_statement: str
    architecture: str
    key_features: List[str]
    suggested_stack: List[str]
    pitch_summary: str
