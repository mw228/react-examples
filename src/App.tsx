import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell } from "./components/Shell";
import { AuthProvider } from "./auth/AuthProvider";

import Home from "./pages/Home";
import Demos from "./pages/Demos";
import ComponentsDemo from "./pages/demos/ComponentsDemo";
import WeatherDemo from "./pages/demos/WeatherDemo";
import TodosDemo from "./pages/demos/TodosDemo";
import FormsDemo from "./pages/demos/FormsDemo";
import DashboardDemo from "./pages/demos/DashboardDemo";

import Production from "./pages/production/Production";
import Skills from "./pages/skills/Skills";

// Auth demo pages
import LoginDemo from "./pages/demos/auth/LoginDemo";
import AuthedApp from "./pages/demos/auth/AuthedApp";
import AdminPage from "./pages/demos/auth/AdminPage";
import Forbidden from "./pages/demos/auth/Forbidden";

// Route guards
import { RequireAuth } from "./auth/RequireAuth";
import { RequireRole } from "./auth/RequireRole";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Shell>
          <Routes>
            {/* Top-level */}
            <Route path="/" element={<Home />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/production" element={<Production />} />
            <Route path="/skills" element={<Skills />} />

            {/* Demos */}
            <Route path="/demos/components" element={<ComponentsDemo />} />
            <Route path="/demos/weather" element={<WeatherDemo />} />
            <Route path="/demos/todos" element={<TodosDemo />} />
            <Route path="/demos/forms" element={<FormsDemo />} />
            <Route path="/demos/dashboard" element={<DashboardDemo />} />

            {/* Auth demo */}
            <Route path="/demos/auth/login" element={<LoginDemo />} />
            <Route path="/demos/auth/forbidden" element={<Forbidden />} />

            <Route
              path="/demos/auth/app"
              element={
                <RequireAuth>
                  <AuthedApp />
                </RequireAuth>
              }
            />

            <Route
              path="/demos/auth/admin"
              element={
                <RequireRole role="admin">
                  <AdminPage />
                </RequireRole>
              }
            />

            {/* Catch-all (keep last) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </HashRouter>
    </AuthProvider>
  );
}
