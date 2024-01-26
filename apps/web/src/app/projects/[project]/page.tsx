import "./Project.styles.css";
import { ProjectPreview } from "./_components/ProjectPreview";

export default function Project({ params }) {
  return (
    <main className="project-item">
      <h1>Project Title</h1>
      <ProjectPreview />
      <section className="project-description">
        <p className="caption">This project is very cute</p>
      </section>
    </main>
  );
}
