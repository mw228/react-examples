import { Link } from "react-router-dom";

type Demo = {
  title: string;
  description: string;
  to: string;
  tag: string;
  external?: boolean;
};

const demos: Demo[] = [
  {
    title: "Component Library Sample",
    description:
      "Buttons, cards, layout primitives. A11y defaults and clean props typing.",
    to: "/demos/components",
    tag: "UI Kit",
  },
  {
    title: "Forms Demo",
    description:
      "React Hook Form + Zod validation, async submit, accessible error handling.",
    to: "/demos/forms",
    tag: "Forms",
  },
  {
    title: "Dashboard Demo",
    description:
      "Filtering, sorting, pagination, URL state, loading and error UX.",
    to: "/demos/dashboard",
    tag: "Data UI",
  },
  {
    title: "Vue Sample Work",
    description:
      "A separate Vue project demonstrating component structure, routing, and GitHub Pages deployment.",
    to: "https://mw228.github.io/Sample-Work/",
    tag: "Vue",
    external: true,
  },
  {
  title: "Weather API Demo",
  description:
    "External API integration with search, loading/error UX, accessible results list, and typed responses.",
  to: "/demos/weather",
  tag: "API",
},
{
  title: "Todo List (Interview Demo)",
  description:
    "Add/remove/toggle items with accessible controls and persistence via localStorage.",
  to: "/demos/todos",
  tag: "State",
},
{
  title: "Auth + Protected Routes",
  description: "Mock login, session persistence, protected routes, and role-based access control.",
  to: "/demos/auth/login",
  tag: "Auth"
},


];

export default function Demos() {
  return (
    <div>
      <h2 className="page-title">Demos</h2>
      <p className="page-subtitle">
        Each demo is intentionally small: quick to review, easy to discuss, and
        built with practical patterns.
      </p>

      <div className="grid grid--cards">
        {demos.map((demo) =>
          demo.external ? (
            <a
              key={demo.to}
              href={demo.to}
              target="_blank"
              rel="noreferrer"
              className="card"
            >
              <div className="card-top">
                <div className="card-title">{demo.title}</div>
                <div className="card-tag">{demo.tag}</div>
              </div>
              <div className="card-desc">{demo.description}</div>
              <div className="card-cta">Open ↗</div>
            </a>
          ) : (
            <Link key={demo.to} to={demo.to} className="card">
              <div className="card-top">
                <div className="card-title">{demo.title}</div>
                <div className="card-tag">{demo.tag}</div>
              </div>
              <div className="card-desc">{demo.description}</div>
              <div className="card-cta">Open →</div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
