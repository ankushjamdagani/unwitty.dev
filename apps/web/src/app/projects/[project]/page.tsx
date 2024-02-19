import { BsCalendar2Date } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

import "./Project.styles.css";

import { BreadCrumb } from "@/app/_components/Breadcrumb";
import { ProjectPreview } from "./_components/ProjectPreview";

export default function Project({ params }) {
  console.log("params", params);
  return (
    <main className="project-wrapper">
      <header className="project-header">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/projects", label: "Projects" },
            { label: "Current" },
          ]}
        />

        <h1>Project Name</h1>

        <ul className="project-meta">
          <li className="project-author">
            <Image
              src="/images/projects/gameboy_tetris.jpeg"
              alt="some text"
              width="32"
              height="32"
            />
            <a href="/about">Ankush Jamdagani</a>
          </li>

          <li className="project-date">
            <BsCalendar2Date /> <time>{new Date().toDateString()}</time>
          </li>
        </ul>
      </header>

      <ProjectPreview />

      <section className="project-description">
        <p className="caption">
          This project is very cute. Some long description will tell about the
          project. Maybe some inspiration. Maybe some random think. Some
          external links are mentioned elsewhere.
        </p>

        <p>
          Words can be like X-rays, if you use them properly—they’ll go through
          anything. You read and you’re pierced. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Nisl nunc mi ipsum
          faucibus vitae aliquet. risus nec feugiat in fermentum posuere. Neque
          sodales ut etiam sit. Vulputate eu scelerisque felis imperdiet proin
          fermentum leo vel. Consectetur purus ut faucibus pulvinar elementum.
          Enim sit amet venenatis urna cursus. Porta non pulvinar neque laoreet
        </p>
      </section>

      <footer className="project-footer">
        <ul className="tags-wrapper">
          <li className="tag">Typescript</li>
          <li className="tag">Web Security</li>
          <li className="tag">DDOS attack</li>
          <li className="tag">CSRF Attacks</li>
          <li className="tag">Content Security Policies</li>
        </ul>

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
      </footer>

      <div>
        <div className="seperator-sq"></div>
      </div>
    </main>
  );
}
