type SkillGroup = { title: string; items: string[] };

const groups: SkillGroup[] = [
  {
    title: "Frontend Engineering",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue.js",
      "Nuxt.js",
      "HTML5",
      "CSS / SCSS (SASS)",
      "Responsive Web Design",
      "Bootstrap",
      "Tailwind CSS",
      "User Interface Design",
      "User Experience (UX)",
      "Web Standards",
      "Web Applications",
    ],
  },
  {
    title: "Accessibility & Quality",
    items: [
      "Web Content Accessibility Guidelines (WCAG)",
      "Accessibility remediation",
      "Keyboard navigation & focus management",
      "Semantic HTML",
      "Bug Tracking",
      "Regression testing",
      "Cross-browser testing",
      "Error handling",
      "Problem Solving",
    ],
  },
  {
    title: "Backend, APIs & Data",
    items: [
      "Node.js",
      "REST APIs",
      "JSON",
      "SQL",
      "Databases",
      "Object-Oriented Programming (OOP)",
      "Data Structures",
      "Client-side state management",
      "Content Management Systems (CMS)",
    ],
  },
  {
    title: "DevOps, Cloud & Tooling",
    items: [
      "Azure DevOps",
      "Azure DevOps Services",
      "CI/CD pipelines",
      "Git / GitHub",
      "Amazon Web Services (AWS)",
      "VirtualBox",
    ],
  },
  {
    title: "Languages & Technical Foundations",
    items: [
      "Java",
      "C",
      "C++",
      "C#",
      "Python",
      "jQuery",
      "p5.js",
      "MATLAB",
      "RStudio",
      "Programming Languages",
      "Computer Science fundamentals",
    ],
  },
  {
    title: "Delivery, Process & Collaboration",
    items: [
      "Agile Methodologies",
      "Agile Web Development",
      "Scrum collaboration",
      "Leadership",
      "Teamwork",
      "Communication",
      "Interpersonal Skills",
      "Public Speaking",
      "Presentation Skills",
    ],
  },
];

export default function Skills() {
  return (
    <div>
      <h2 className="page-title">Skills</h2>
      <p className="page-subtitle">
        A recruiter-friendly snapshot of my technical skills, tooling, and
        delivery experience across frontend, accessibility, and production
        systems.
      </p>

      <div className="grid grid--cards">
        {groups.map((g) => (
          <section key={g.title} className="card" aria-label={g.title}>
            <div className="card-top">
              <div className="card-title">{g.title}</div>
              <div className="card-tag">Core</div>
            </div>

            <ul
              className="card-desc"
              style={{ margin: 0, paddingLeft: "1.1rem" }}
            >
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
