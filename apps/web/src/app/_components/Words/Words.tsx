import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

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
      <ul className="group/list flex">
        {List.map((post) => (
          <li
            key={post.id}
            className="group-hover/list:opacity-50 hover:!opacity-100 flex w-full items-stretch justify-stretch transition-all duration-300"
          >
            <Link
              aria-label={post.title}
              className="post shadow-box flex-col justify-start p-4 text-left"
              href={`/articles/${post.id}`}
            >
              <Image
                alt={post.title}
                className="post-thumb bg-foreground rounded-sm aspect-square w-full"
                height={240}
                src={post.thumbnail.src}
                width={240}
              />
              <h3 className="post-title my-4 w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.2em] font-bold">
                {post.title}
              </h3>
              <p className="post-description mb-4 w-full text-[0.85em]">
                {post.description}
              </p>
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
