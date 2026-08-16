# 🚀 Innovate AI Hackathon Platform

A full-stack hackathon management platform with an **AI-powered chatbot assistant** that answers participant questions in real-time using RAG (Retrieval-Augmented Generation) over the official hackathon rulebook.

---

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, Framer Motion, Three.js |
| **Backend** | FastAPI (Python), SQLAlchemy, SQLite |
| **AI Service** | FastAPI, LangChain, Google Gemini (gemini-3.5-flash-lite + gemini-embedding-2), In-Memory RAG |
| **Voice** | ElevenLabs Text-to-Speech |
| **Auth** | JWT (python-jose) |

---

## 🏗️ Architecture

```
User
 │
 ▼
Vercel (Next.js Frontend)
 │   NEXT_PUBLIC_API_URL
 ▼
Backend FastAPI  (:8000)
 │   AI_SERVICE_URL
 ▼
AI Microservice  (:8001)
 │
 ├── LangChain RAG (InMemoryVectorStore + Gemini Embeddings)
 ├── Hackathon Rulebook (ai-service/data/rulebook.txt)
 └── Google Gemini (gemini-3.5-flash-lite)
```

---

## 🗂️ Project Structure

```
Hackathon website-AI/
├── frontend/          # Next.js app (deployed to Vercel)
├── backend/           # FastAPI backend (deployed to Railway/Render)
├── ai-service/        # Python AI microservice (deployed to Railway/Render)
│   ├── app/
│   │   ├── main.py    # FastAPI app + /chat endpoint
│   │   ├── rag.py     # LangChain RAG pipeline
│   │   └── agent.py   # Deep Agent setup
│   └── data/
│       └── rulebook.txt  # Official hackathon knowledge base
└── README.md
```

---

## ⚡ Local Development

### Prerequisites
- Node.js 18+
- Python 3.14+
- [uv](https://docs.astral.sh/uv/) package manager

### 1. Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
npm install
npm run dev
# Runs on http://localhost:3000
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
# Runs on http://localhost:8000
```

### 3. AI Service
```bash
cd ai-service
cp .env.example .env
# Edit .env — add your GOOGLE_API_KEY
uv sync
uv run python main.py
# Runs on http://localhost:8001
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g. `https://your-backend.railway.app/api`) |
| `NEXT_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API key for voice feature |

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT secret key (use a long random string in production) |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | ElevenLabs voice ID |
| `AI_SERVICE_URL` | URL of the AI microservice (e.g. `https://your-ai-service.railway.app`) |
| `FRONTEND_URL` | Production frontend URL for CORS (e.g. `https://your-app.vercel.app`) |

### AI Service (`ai-service/.env`)
| Variable | Description |
|---|---|
| `GOOGLE_API_KEY` | Google Gemini API key — get free at https://aistudio.google.com/app/apikey |

---

## 🚀 Deployment

### Frontend → Vercel
1. Import GitHub repository in Vercel
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm run build`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_ELEVENLABS_API_KEY` = your key

### Backend → Railway / Render
1. Deploy `backend/` folder
2. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. Add environment variables from `backend/.env.example`

### AI Service → Railway / Render
1. Deploy `ai-service/` folder
2. Set start command: `uv run python main.py`
3. Add `GOOGLE_API_KEY` environment variable

> ⚠️ **Never** commit `.env` files or API keys to Git.

---

## 🤖 AI Chatbot

The chatbot uses RAG to answer questions from the official hackathon rulebook:
- Rules & eligibility
- Registration & deadlines
- Food, accommodation & logistics
- Judging criteria & prizes
- Submission guidelines
- Team composition

If a question is not in the rulebook, it responds with a graceful fallback instead of hallucinating.

---

## 📋 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/teams` | List teams |
| GET | `/api/projects` | List projects |
| POST | `/api/chat` | Send chat message |
| GET | `/api/chat/stream` | SSE streaming chat |
| POST | `/api/voice/synthesize` | TTS voice synthesis |

---

## 🛡️ Security Notes

- API keys are stored in `.env` files (never committed)
- JWT tokens used for authentication
- CORS restricted to known frontend origin in production
- `NEXT_PUBLIC_*` variables are browser-visible — never put secret keys there
