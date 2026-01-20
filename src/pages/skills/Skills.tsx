type SkillGroup = { title: string; items: string[] };

const groups: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "Vue 3",
      "Nuxt 3",
      "React",
      "HTML",
      "CSS/SCSS",
      "Tailwind",
      "Bootstrap",
    ],
  },
  {
    title: "Integration & Data",
    items: [
      "REST APIs",
      "JSON",
      "CMS integrations",
      "Client-side state management",
      "Error handling",
    ],
  },
  {
    title: "DevOps & Tooling",
    items: ["Azure DevOps", "Git/GitHub", "CI/CD pipelines", "AWS (foundational)"],
  },
  {
    title: "Quality & Practices",
    items: [
      "Regression testing",
      "Accessibility (WCAG)",
      "Cross-browser testing",
      "Agile/Scrum",
      "Code reviews",
    ],
  },
];

export default function Skills() {
  return (
    <div>
      <h2 className="page-title">Skills</h2>
      <p className="page-subtitle">
        A quick snapshot of my core skills and the tools I use most often.
      </p>

      <div className="grid grid--cards">
        {groups.map((g) => (
          <section key={g.title} className="card" aria-label={g.title}>
            <div className="card-top">
              <div className="card-title">{g.title}</div>
              <div className="card-tag">Core</div>
            </div>

            <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
