import { getAuthToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "An unexpected error occurred";
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errorMsg;
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: any) => fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => fetchAPI("/auth/me"),

  // Teams
  createTeam: (data: { name: string; track?: string }) => fetchAPI("/teams", { method: "POST", body: JSON.stringify(data) }),
  getMyTeam: () => fetchAPI("/teams/my-team"),
  addMember: (teamId: string, email: string) => fetchAPI(`/teams/${teamId}/members`, { method: "POST", body: JSON.stringify({ email }) }),
  joinTeam: (code: string) => fetchAPI(`/teams/join/${code}`, { method: "POST" }),

  // Projects
  createProject: (data: any) => fetchAPI("/projects", { method: "POST", body: JSON.stringify(data) }),
  getMyProject: () => fetchAPI("/projects/my-project"),
  updateProject: (id: string, data: any) => fetchAPI(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getAllProjects: () => fetchAPI("/submissions/all-projects"),
  submitJudgeScore: (projectId: string, scores: any) => fetchAPI(`/projects/${projectId}/judge-score`, { method: "POST", body: JSON.stringify(scores) }),

  // Submissions
  submitProject: () => fetchAPI("/submissions", { method: "POST" }),
  getMySubmission: () => fetchAPI("/submissions/my-submission"),

  // RAG & Documents
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchAPI("/documents/upload", { method: "POST", body: formData });
  },
  listDocuments: () => fetchAPI("/documents"),
  deleteDocument: (id: string) => fetchAPI(`/documents/${id}`, { method: "DELETE" }),
  testSearch: (query: string) => fetchAPI(`/documents/test-search?query=${encodeURIComponent(query)}`, { method: "POST" }),

  // AI Chat & Assistant
  askChat: (message: string, sessionId?: string) => fetchAPI("/chat", {
    method: "POST",
    body: JSON.stringify({ message, session_id: sessionId })
  }),
  getChatHistory: (sessionId: string) => fetchAPI(`/chat/history/${sessionId}`),
  
  // High Impact AI Features
  generateProjectAssistant: (idea: string, track: string) => fetchAPI("/ai/project-assistant", {
    method: "POST",
    body: JSON.stringify({ idea, track })
  }),
  evaluateProject: (projectId: string) => fetchAPI(`/ai/evaluate-project/${projectId}`, { method: "POST" }),
};
