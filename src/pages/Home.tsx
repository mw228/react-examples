import { Link } from "react-router-dom";

const RESUME_URL = "/react-examples/Matthew_Wilson_Resume.pdf";
const LINKEDIN_URL = "https://linkedin.com/in/matthew-wilson-856130221";
const GITHUB_URL = "https://github.com/mw228";
const VUE_SITE_URL = "https://mw228.github.io/Sample-Work/";

export default function Home() {
  return (
    <div className="home">
      <div className="kicker">MATTHEW WILSON • FRONTEND-LEANING FULL-STACK</div>

      <h1 className="hero-title">
        Grounded in craft.
        <br />
        Built to ship.
      </h1>

      <p className="hero-subtitle">
        I build accessible, production-ready web experiences with React/Vue, TypeScript, and modern UI architecture.
        This site is my living portfolio: small, reviewable demos plus links to real production work.
      </p>

      <div className="hero-actions">
        <Link to="/demos" className="pill pill--primary">
          View demos →
        </Link>

        <Link to="/production" className="pill">
          Production work →
        </Link>

        <Link to="/skills" className="pill">
          Skills →
        </Link>

        <a className="pill" href={RESUME_URL} target="_blank" rel="noreferrer">
          Resume ↗
        </a>

        <a className="pill" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>

        <a className="pill" href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </div>

      {/* Highlights */}
      <div className="grid grid--cards" style={{ marginTop: 24 }}>
        <section className="card" aria-label="Accessibility and quality">
          <div className="card-top">
            <div className="card-title">Accessibility-first UI</div>
            <div className="card-tag">WCAG</div>
          </div>
          <div className="card-desc">
            Semantic HTML, keyboard support, focus management, and error UX that’s actually usable.
          </div>
          <div className="card-cta">
            <Link className="navlink" to="/demos">
              See patterns →
            </Link>
          </div>
        </section>

        <section className="card" aria-label="Modern React engineering">
          <div className="card-top">
            <div className="card-title">Modern React + TypeScript</div>
            <div className="card-tag">DX</div>
          </div>
          <div className="card-desc">
            Typed components, reusable primitives, scalable routing, and clean structure you can discuss in an interview.
          </div>
          <div className="card-cta">
            <Link className="navlink" to="/demos/components">
              Component library →
            </Link>
          </div>
        </section>

        <section className="card" aria-label="Cross-framework experience">
          <div className="card-top">
            <div className="card-title">Cross-framework experience</div>
            <div className="card-tag">React + Vue</div>
          </div>
          <div className="card-desc">
            Comfortable shipping production UI across React and Vue with consistent patterns and maintainable styles.
          </div>
          <div className="card-cta">
            <a className="navlink" href={VUE_SITE_URL} target="_blank" rel="noreferrer">
              Vue sample site ↗
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
