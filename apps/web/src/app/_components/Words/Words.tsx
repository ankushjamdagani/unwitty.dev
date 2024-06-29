import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import "./Words.styles.css";

const List = [
  {
    id: "blog 1",
    title: "This is the title for blog 1",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
  {
    id: "blog 2",
    title: "This is the title for blog 2",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
  {
    id: "blog 3",
    title: "This is the title for blog 3 and this can be long too",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
  {
    id: "blog 4",
    title: "This is the title for blog 4 and this can be long too",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
  {
    id: "blog 5",
    title: "This is the title for blog 5 and this can be long too",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
  {
    id: "blog 6",
    title: "This is the title for blog 6",
    description: "Contrary to popular belief, Lorem Ipsum is not simply. ",
    thumbnail: {
      src: "/abc.jpg",
      type: "gif",
    },
  },
];

export function Words() {
  return (
    <section id="words" className="container">
      <h2>Thoughts</h2>
      <ul>
        {List.map((post) => (
          <li key={post.id}>
            <Link
              aria-label={post.title}
              className="post shadow-box"
              href={`/articles/${post.id}`}
            >
              <Image
                alt={post.title}
                className="post-thumb"
                height={240}
                src={post.thumbnail.src}
                width={240}
              />
              <h3 className="post-title">{post.title}</h3>
              <p className="post-description">{post.description}</p>
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
