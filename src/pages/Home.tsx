import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="kicker">REACT SAMPLE LIBRARY</div>
      <h1 className="hero-title">
        Grounded in Craft.
        <br />
        Built to Ship.
      </h1>
      <p className="hero-subtitle">
        A recruiter-friendly set of React demos and UI components: TypeScript patterns, accessibility, and practical UI
        architecture.
      </p>

      <div className="hero-actions">
        <Link to="/demos" className="pill pill--primary">
          View demos →
        </Link>
        <a className="pill" href="https://github.com/mw228" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </div>
    </div>
  );
}
