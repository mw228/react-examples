import { Link } from "react-router-dom";

const RESUME_URL = "/react-examples/Matthew_Wilson_Software_Engineer.pdf";
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
        <a className="pill pill--primary" href="https://mw228.github.io/resume-builder/" target="_blank" rel="noreferrer">
  Resume Builder →
</a>
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
  {/* Resume Builder (FEATURED) */}
  <section className="card card--featured" aria-label="Resume Builder application">
    <div className="card-top">
      <div className="card-title">Resume Builder</div>
      <div className="card-tag">FEATURED</div>
    </div>
    <div className="card-desc">
      Full application with real-time editing, structured data modeling, and print-optimized PDF generation.
    </div>
    <div className="card-cta mt-4">
  <div className="cta-primary">
    <a
      className="pill pill--primary"
      href="https://mw228.github.io/resume-builder/"
      target="_blank"
      rel="noreferrer"
    >
      View project →
    </a>
  </div>

  <a
    href="https://github.com/mw228/resume-builder"
    target="_blank"
    rel="noreferrer"
    className="cta-secondary"
  >
    GitHub ↗
  </a>
</div>
  </section>

  {/* React Demos */}
  <section className="card" aria-label="React demos">
    <div className="card-top">
      <div className="card-title">React Demos</div>
      <div className="card-tag">UI</div>
    </div>
    <div className="card-desc">
      Forms, dashboards, authentication, API state, and data visualization patterns built as small, reviewable demos.
    </div>
    <div className="card-cta">
      <Link className="navlink" to="/demos">
        Explore demos →
      </Link>
    </div>
  </section>

  {/* Vue Sample Site */}
  <section className="card" aria-label="Vue sample site">
    <div className="card-top">
      <div className="card-title">Vue Sample Site</div>
      <div className="card-tag">Vue</div>
    </div>
    <div className="card-desc">
      Production-style Vue app demonstrating routing, layout structure, and deploy-ready architecture.
    </div>
    <div className="card-cta">
      <a className="navlink" href={VUE_SITE_URL} target="_blank" rel="noreferrer">
        View site →
      </a>
    </div>
  </section>
</div>
    </div>
  );
}
