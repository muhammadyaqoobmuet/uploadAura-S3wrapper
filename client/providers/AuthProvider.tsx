"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/api";
import { clearAuth, getUser, isAuthenticated, saveAuth } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, expiresAt: number, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (token: string, expiresAt: number, userData: User) => {
      saveAuth(token, expiresAt, userData);
      setUser(userData);

      // Set cookies so middleware can read auth state
      const maxAge = Math.floor((expiresAt - Date.now()) / 1000);
      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
      document.cookie = `auth_expires=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Strict`;

      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "auth_expires=; path=/; max-age=0";
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
