import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="page-subtitle">Checking session…</div>;
  }

  if (status === "guest") {
    return <Navigate to="/demos/auth/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <>{children}</>;
}
