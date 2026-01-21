import { Card } from "../../../ui/Card";
import { useAuth } from "../../../auth/AuthProvider";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="page-title">Admin Only</h2>
      <p className="page-subtitle">Role-gated route example.</p>

      <div className="grid grid--cards">
        <Card title="Access granted" description="You’re allowed to view this route.">
          <div className="demo-note">
            Hello <strong>{user?.name}</strong>. Your role is <strong>{user?.role}</strong>.
          </div>
        </Card>
      </div>
    </div>
  );
}
