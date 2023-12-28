import Link from "next/link";

import "./Projects.styles.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const List = [
  {
    name: "project 1",
    path: "project 1",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    name: "project 2",
    path: "project 2",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    name: "project 3",
    path: "project 3",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    name: "project 4",
    path: "project 4",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    name: "project 5",
    path: "project 5",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    name: "project 6",
    path: "project 6",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
];

export function Projects() {
  return (
    <section id="projects">
      <header>
        <h2>Experiments</h2>
      </header>
      <ul>
        {List.map((project) => (
          <li key={project.path} className={project.name.replace(" ", "-")}>
            <Link href={`#${project.path}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
      <footer>
        <button className="project-prev" aria-label="Previous projects">
          <FaAngleLeft />
        </button>
        <div className="seperator"></div>
        <button className="project-next" aria-label="Next projects">
          <FaAngleRight />
        </button>
      </footer>
    </section>
  );
}
