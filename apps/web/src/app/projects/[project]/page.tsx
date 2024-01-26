import "./Project.styles.css";

export default function Project({ params }) {
  return (
    <main className="project-item">
      <h1>Project Title</h1>
      <section className="project-preview">
        <header className="project-controls">
          <p>Preview</p>
          <button>Show full screen preview</button>
        </header>
      </section>
      <section className="project-description">
        <p className="caption">This project is very cute</p>
      </section>
    </main>
  );
}
