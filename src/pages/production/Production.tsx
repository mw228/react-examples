type ProductionSite = {
  title: string;
  description: string;
  href: string;
  tag: string;
};

const sites: ProductionSite[] = [
  {
    title: "Navient.com",
    description:
      "Full rebuild and modernization using modern Vue/React architecture.",
    href: "https://navient.com",
    tag: "Vue/React",
  },
  {
    title: "PioneerCreditRecovery.com",
    description:
      "Modernization and migration from Bootstrap to Tailwind CSS, improving responsiveness and maintainability.",
    href: "https://pioneercreditrecovery.com",
    tag: "Tailwind",
  },
  {
    title: "MSBGovServ.com",
    description:
      "Accessibility remediation and responsive upgrades to modernize legacy layouts.",
    href: "https://msbgovserv.com",
    tag: "WCAG",
  },
];

export default function Production() {
  return (
    <div>
      <h2 className="page-title">Production Work</h2>
      <p className="page-subtitle">
        A small set of production websites I contributed to. These link out to
        the live sites.
      </p>

      <div className="grid grid--cards">
        {sites.map((site) => (
          <a
            key={site.href}
            href={site.href}
            target="_blank"
            rel="noreferrer"
            className="card"
          >
            <div className="card-top">
              <div className="card-title">{site.title}</div>
              <div className="card-tag">{site.tag}</div>
            </div>
            <div className="card-desc">{site.description}</div>
            <div className="card-cta">Open ↗</div>
          </a>
        ))}
      </div>
    </div>
  );
}
