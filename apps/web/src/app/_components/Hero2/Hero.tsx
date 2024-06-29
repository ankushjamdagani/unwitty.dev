import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

import "./Hero.styles.css";

import { Time } from "@/components/Time";
import { AnimatedWordList } from "@/components/AnimatedWordList";
import { TypeWord, TypeWordCursor } from "@/components/TypeWord";

const image = {
  src: "/images/profile_1.jpg",
  alt: "Not me faking meditation",
  width: 200,
  height: 300,
};

const LoveAllThings = [
  {
    label: "Javascript",
    time: 1000,
  },
  {
    label: "html/css",
    time: 700,
  },
  {
    label: "User Interface",
    time: 1200,
  },
];

const Status = [
  {
    label: "Open to Work",
  },
  {
    label: "Open to Collaborate",
  },
  {
    label: "Open to Innovate",
  },
];

export function Hero() {
  return (
    <section id="home">
      <h1>Ankush J.</h1>

      <p className="pseudo-name">
        a.k.a. <strong>Unwitty</strong>.dev
      </p>

      <p>
        Frontend Developer for 7 years, weaving digital tales and embracing the
        lazy coder&apos;s lifestyle. <br /> <br />
        <strong>
          ❤️ all things{" "}
          <AnimatedWordList transitionTime={3000}>
            {LoveAllThings.map((love) => (
              <TypeWord
                cursorType={TypeWordCursor.VERT_THICK}
                key={love.label}
                time={love.time}
              >
                {love.label}
              </TypeWord>
            ))}
          </AnimatedWordList>
        </strong>
        <br /> <br />
        Beyond the screen, you&apos;ll find me exploring new places and
        relishing tasty eats.
        <br /> <br />
        Join me on this journey of lazy brilliance and vibrant exploration! 🚀🍜
      </p>

      <div className="seperator-rect"></div>

      <ul className="social-links">
        <li>
          <Link href="#">
            <FaGithub />
          </Link>
        </li>
        <li>
          <Link href="#">
            <FaXTwitter />
          </Link>
        </li>
        <li>
          <Link href="#">
            <FaLinkedinIn />
          </Link>
        </li>
        <li>
          <Link href="#">
            <FaRegEnvelope />
          </Link>
        </li>
      </ul>

      <div className="right-panel">
        {image && (
          <figure className="rotating-hero-image">
            <Image {...image} alt={image.alt} />
            <figcaption>{image.alt}</figcaption>
          </figure>
        )}
      </div>

      <footer>
        <em>
          Based in India →{" "}
          <strong>
            <Time />
          </strong>
        </em>
        <em>
          Status → <strong></strong>
          <AnimatedWordList transitionTime={2000}>
            {Status.map((st) => (
              <strong key={st.label}>{st.label}</strong>
            ))}
          </AnimatedWordList>
        </em>
      </footer>
    </section>
  );
}
