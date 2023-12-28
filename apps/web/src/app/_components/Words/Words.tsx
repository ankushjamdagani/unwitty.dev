import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import "./Words.styles.css";

const List = [
  {
    id: "blog 1",
    title: "blog 1",
    description: "blog 1 blog 1 blog 1 blog 1 blog 1 blog 1 blog 1",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "blog 2",
    title: "blog 2",
    description: "blog 2 blog 2 blog 2 blog 2 blog 2 blog 2 blog 2",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "blog 3",
    title: "blog 3",
    description: "blog 3 blog 3 blog 3 blog 3 blog 3 blog 3 blog 3",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "blog 4",
    title: "blog 4",
    description: "blog 4 blog 4 blog 4 blog 4 blog 4 blog 4 blog 4",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "blog 5",
    title: "blog 5",
    description: "blog 5 blog 5 blog 5 blog 5 blog 5 blog 5 blog 5",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
  {
    id: "blog 6",
    title: "blog 6",
    description: "blog 6 blog 6 blog 6 blog 6 blog 6 blog 6 blog 6",
    thumbnail: {
      src: ".",
      type: "gif",
    },
  },
];

export function Words() {
  return (
    <section id="words" className="container">
      <header>
        <h2>Thoughts</h2>
      </header>
      <ul>
        {List.map((post) => (
          <li key={post.id}>
            <Link href={`#${post.id}`} className="shadow-box">
              {post.title}
            </Link>
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
