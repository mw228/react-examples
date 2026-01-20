import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell } from "./components/Shell";
import Home from "./pages/Home";
import Demos from "./pages/Demos";
import ComponentsDemo from "./pages/demos/ComponentsDemo";


export default function App() {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/demos/components" element={<ComponentsDemo />} />

        </Routes>
      </Shell>
    </HashRouter>
  );
}
