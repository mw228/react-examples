import { Link } from "react-router-dom";

type Demo = { title: string; description: string; to: string; tag: string };

const demos: Demo[] = [
  { title: "Component Library Sample", description: "Buttons, cards, layout primitives. A11y defaults and clean props typing.", to: "/demos/components", tag: "UI Kit" },
  { title: "Forms Demo (coming soon)", description: "React Hook Form + Zod validation, async submit, accessible error handling.", to: "/demos/forms", tag: "Forms" },
  { title: "Dashboard Demo (coming soon)", description: "Filtering, sorting, pagination, URL state, loading and error UX.", to: "/demos/dashboard", tag: "Data UI" },
];

export default function Demos() {
  return (
    <div>
      <h2 className="page-title">Demos</h2>
      <p className="page-subtitle">
        Each demo is intentionally small: quick to review, easy to discuss, and built with practical patterns.
      </p>

      <div className="grid grid--cards">
        {demos.map((demo) => (
          <Link key={demo.to} to={demo.to} className="card">
            <div className="card-top">
              <div className="card-title">{demo.title}</div>
              <div className="card-tag">{demo.tag}</div>
            </div>
            <div className="card-desc">{demo.description}</div>
            <div className="card-cta">Open →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
