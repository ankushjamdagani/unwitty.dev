import Link from "next/link";

import "./Projects.styles.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const List = [
  {
    id: "project 1",
    title: "project 1",
    description:
      "project 1 project 1 project 1 project 1 project 1 project 1 project 1",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "project 2",
    title: "project 2",
    description:
      "project 2 project 2 project 2 project 2 project 2 project 2 project 2",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "project 3",
    title: "project 3",
    description:
      "project 3 project 3 project 3 project 3 project 3 project 3 project 3",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "project 4",
    title: "project 4",
    description:
      "project 4 project 4 project 4 project 4 project 4 project 4 project 4",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "project 5",
    title: "project 5",
    description:
      "project 5 project 5 project 5 project 5 project 5 project 5 project 5",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "project 6",
    title: "project 6",
    description:
      "project 6 project 6 project 6 project 6 project 6 project 6 project 6",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
];

export function Projects() {
  return (
    <section id="projects" className="container">
      <header>
        <h2>Experiments</h2>
      </header>
      <ul>
        {List.map((project) => (
          <li key={project.id} className={project.id.replace(" ", "-")}>
            <Link href={`#${project.id}`}>{project.title}</Link>
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
