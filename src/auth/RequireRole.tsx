import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { Role } from "./auth";

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { status, user } = useAuth();

  if (status === "loading") return <div className="page-subtitle">Checking permissions…</div>;
  if (status === "guest") return <Navigate to="/demos/auth/login" replace />;

  if (!user || user.role !== role) {
    return <Navigate to="/demos/auth/forbidden" replace />;
  }

  return <>{children}</>;
}
