import { Card } from "../../../ui/Card";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div>
      <h2 className="page-title">Forbidden</h2>
      <p className="page-subtitle">You don’t have permission to view that page.</p>

      <div className="grid grid--cards">
        <Card title="Try again" description="Sign in with the admin account to access admin routes.">
          <div className="demo-row">
            <Link className="pill pill--primary" to="/demos/auth/login">
              Go to login →
            </Link>
            <Link className="pill" to="/demos/auth/app">
              Back to app →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
