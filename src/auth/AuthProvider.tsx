import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthSession, AuthUser, Role } from "./auth";
import { clearSession, loadSession, loginApi, saveSession } from "./auth";

type AuthState = {
  status: "loading" | "authed" | "guest";
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (s) {
      setSession(s);
      setStatus("authed");
    } else {
      setSession(null);
      setStatus("guest");
    }
  }, []);

  // Optional: auto-logout on expiry timer
  useEffect(() => {
    if (!session) return;
    const ms = session.expiresAt - Date.now();
    if (ms <= 0) {
      clearSession();
      setSession(null);
      setStatus("guest");
      return;
    }
    const t = window.setTimeout(() => {
      clearSession();
      setSession(null);
      setStatus("guest");
    }, ms);
    return () => window.clearTimeout(t);
  }, [session]);

  async function login(email: string, password: string) {
    const next = await loginApi(email, password);
    saveSession(next);
    setSession(next);
    setStatus("authed");
  }

  function logout() {
    clearSession();
    setSession(null);
    setStatus("guest");
  }

  const value = useMemo<AuthState>(
    () => ({
      status,
      user: session?.user ?? null,
      token: session?.token ?? null,
      login,
      logout,
      hasRole: (role) => (session?.user?.role ? session.user.role === role : false),
    }),
    [status, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
}
