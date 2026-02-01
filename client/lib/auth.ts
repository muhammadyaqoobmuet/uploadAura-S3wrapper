import { User } from "./api";

const TOKEN_KEY = "token";
const EXPIRES_KEY = "expiresAt";
const USER_KEY = "user";

export function saveAuth(token: string, expiresAt: number, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = getToken();
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!token || !expiresAt) return false;
  return Date.now() < Number(expiresAt);
}
