export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  expiresAt: number; // epoch ms
};

const STORAGE_KEY = "mw.reactExamples.auth.session.v1";

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

// Fake “server” login
export async function loginApi(email: string, password: string): Promise<AuthSession> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 650));

  const e = email.trim().toLowerCase();

  // pretend we have 2 demo accounts
  // admin: admin@demo.com / Password123!
  // user:  user@demo.com  / Password123!
  const okPassword = password === "Password123!";
  const isAdmin = e === "admin@demo.com";
  const isUser = e === "user@demo.com";

  if (!okPassword || (!isAdmin && !isUser)) {
    throw new Error("Invalid email or password.");
  }

  const user: AuthUser = isAdmin
    ? { id: "1", name: "Admin Demo", email: e, role: "admin" }
    : { id: "2", name: "User Demo", email: e, role: "user" };

  // demo “token”
  const token = `demo.${btoa(`${user.id}:${user.email}:${Date.now()}`)}.${Math.random().toString(16).slice(2)}`;

  // 30 minutes expiry
  const expiresAt = Date.now() + 30 * 60 * 1000;

  return { token, user, expiresAt };
}
