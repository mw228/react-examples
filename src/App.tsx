import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell } from "./components/Shell";
import Home from "./pages/Home";
import Demos from "./pages/Demos";
import ComponentsDemo from "./pages/demos/ComponentsDemo";
import Production from "./pages/production/Production";
import Skills from "./pages/skills/Skills";
import WeatherDemo from "./pages/demos/WeatherDemo";
import TodosDemo from "./pages/demos/TodosDemo";
import FormsDemo from "./pages/demos/FormsDemo";
import DashboardDemo from "./pages/demos/DashboardDemo";



export default function App() {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/demos/components" element={<ComponentsDemo />} />
          <Route path="/production" element={<Production />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/demos/weather" element={<WeatherDemo />} />
          <Route path="/demos/todos" element={<TodosDemo />} />
          <Route path="/demos/forms" element={<FormsDemo />} />
          <Route path="/demos/dashboard" element={<DashboardDemo />} />

        </Routes>
      </Shell>
    </HashRouter>
  );
}
