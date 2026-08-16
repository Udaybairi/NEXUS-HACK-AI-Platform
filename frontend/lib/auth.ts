export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  team_id?: string | null;
  created_at: string;
}


export function saveAuthToken(token: string, user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("hackathon_token", token);
    localStorage.setItem("hackathon_user", JSON.stringify(user));
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hackathon_token");
  }
  return null;
}

export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("hackathon_user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("hackathon_token");
    localStorage.removeItem("hackathon_user");
  }
}
