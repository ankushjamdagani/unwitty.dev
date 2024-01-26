import Link from "next/link";

import "./Projects.styles.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Image from "next/image";

const List = [
  {
    id: "gameboy_tetris",
    title: "Gameboy - Tetris",
    description: "Gameboy like mobile experience for Tetris in retro style",
    thumbnail: {
      src: "/images/projects/gameboy_tetris.jpeg",
      type: "image",
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
];

export function Projects() {
  return (
    <section id="projects" className="container">
      <h2>Experiments</h2>
      <ul>
        {List.map((project) => (
          <li
            key={project.id}
            className={`project-item-wrapper ${project.id.replace(" ", "-")}`}
          >
            <Link
              href={`/projects/${project.id}`}
              className="project-item shadow-box"
            >
              <div className="details">
                <h3 className="title">{project.title}</h3>
                <p className="description">{project.description}</p>
              </div>
              {project.thumbnail.type == "image" && (
                <Image
                  src={project.thumbnail.src}
                  alt={project.title}
                  width={200}
                  height={200}
                  className="preview-thumb"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
      <footer>
        <button className="project-prev" aria-label="Previous projects">
          <FaAngleLeft />
        </button>
        <div className="seperator-rect"></div>
        <button className="project-next" aria-label="Next projects">
          <FaAngleRight />
        </button>
      </footer>
    </section>
  );
}
