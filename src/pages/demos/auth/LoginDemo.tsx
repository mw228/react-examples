import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { useAuth } from "../../../auth/AuthProvider";

type LocationState = { from?: string };

export default function LoginDemo() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const st = location.state as LocationState | null;
    return st?.from || "/demos/auth/app";
  }, [location.state]);

  const [email, setEmail] = useState("user@demo.com");
  const [password, setPassword] = useState("Password123!");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="page-title">Auth Demo</h2>
      <p className="page-subtitle">
        Mock authentication with session persistence, protected routes, and role-based access.
      </p>

      <div className="grid grid--cards">
        <Card title="Login" description="Use the demo accounts below. Session is stored in localStorage.">
          {err && (
            <div className="form-banner" role="alert">
              {err}
            </div>
          )}

          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </div>

            <div className="hint" style={{ marginTop: 12 }}>
              Demo accounts:
              <ul style={{ marginTop: 6 }}>
                <li>
                  <code>user@demo.com</code> / <code>Password123!</code>
                </li>
                <li>
                  <code>admin@demo.com</code> / <code>Password123!</code>
                </li>
              </ul>
            </div>
          </form>
        </Card>

        <Card title="What this demonstrates" description="Common auth patterns without a backend.">
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Protected routes redirect guests to login</li>
            <li>Return-to path after successful login</li>
            <li>Session persistence using localStorage</li>
            <li>Role-based access control (admin-only page)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
