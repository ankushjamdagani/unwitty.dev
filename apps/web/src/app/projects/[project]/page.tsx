import "./Project.styles.css";
import { PreviewControls } from "./_components/PreviewControls";

export default function Project({ params }) {
  return (
    <main className="project-item">
      <h1>Project Title</h1>
      <section className="project-preview">
        <header className="project-preview-header">
          <p>Preview</p>
          <PreviewControls />
        </header>
      </section>
      <section className="project-description">
        <p className="caption">This project is very cute</p>
      </section>
    </main>
  );
}
