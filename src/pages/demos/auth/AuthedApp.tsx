import { Card } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";

export default function AuthedApp() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2 className="page-title">Protected App</h2>
      <p className="page-subtitle">You can only see this after logging in.</p>

      <div className="grid grid--cards">
        <Card title="Session" description="This is what the app knows about you.">
          <div className="demo-stack">
            <div className="demo-note">
              Signed in as <strong>{user?.name}</strong> ({user?.email})
            </div>
            <div className="demo-note">
              Role: <strong>{user?.role}</strong>
            </div>

            <div className="demo-row">
              <Button variant="ghost" onClick={logout}>
                Log out
              </Button>
              <Link className="pill" to="/demos/auth/admin">
                Admin page →
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Next" description="Try role-based routing.">
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Sign in as <code>user@demo.com</code>, then open Admin page (should be blocked)</li>
            <li>Sign in as <code>admin@demo.com</code>, Admin page should allow access</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
