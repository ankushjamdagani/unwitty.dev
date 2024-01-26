import Link from "next/link";
import "./Project.styles.css";
import { ProjectPreview } from "./_components/ProjectPreview";

export default function Project({ params }) {
  console.log("params", params);
  return (
    <main className="project-item">
      <h1>Project Title</h1>
      <ProjectPreview />
      <section className="project-description">
        <p className="caption">
          This project is very cute. Some long description will tell about the
          project. Maybe some inspiration. Maybe some random think. Some
          external links are mentioned elsewhere.
        </p>
      </section>

      <section className="project-learnings">
        <h2>Related articles?</h2>
        <ul>
          <li>
            <Link href={"#"}>How to be lazy?</Link>
          </li>
          <li>
            <Link href={"#"}>Art of doing nothing</Link>
          </li>
          <li>
            <Link href={"#"}>Fuck all this</Link>
          </li>
        </ul>
      </section>

      <div>
        <div className="seperator-sq"></div>
      </div>
    </main>
  );
}
