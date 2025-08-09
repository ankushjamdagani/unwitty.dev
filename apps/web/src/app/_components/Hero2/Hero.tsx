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

const LoveAllThings = [
  {
    label: "Javascript",
    time: 1000,
  },
  {
    label: "golang",
    time: 700,
  },
  {
    label: "react.js",
    time: 1000,
  },
  {
    label: "User Interface",
    time: 1200,
  },
  {
    label: "Microservices",
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

const SocialLinks = [
  {
    label: "GitHub",
    icon: <FaGithub />,
    url: "https://github.com/ankushjamdagani",
  },
  {
    label: "Twitter",
    icon: <FaXTwitter />,
    url: "https://twitter.com/ankushjamdagani",
  },
  {
    label: "LinkedIn",
    icon: <FaLinkedinIn />,
    url: "https://www.linkedin.com/in/ankushjamdagani/",
  },
  {
    label: "Email",
    icon: <FaRegEnvelope />,
    url: "mailto:anqushjamdagani@gmail.com",
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
        Frontend Developer for 7 years, now full-stack for the past{" "}
        {new Date().getFullYear() - new Date(2024, 4, 1).getFullYear()} -
        weaving digital tales and embracing the lazy coder&apos;s lifestyle.{" "}
        <br /> <br />
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
        {SocialLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.url}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          </li>
        ))}
      </ul>

      <div className="right-panel">
        <figure className="rotating-hero-image">
          <Image
            alt="Profile Picture"
            height={300}
            src="/images/profile.png"
            width={200}
            style={{
              objectPosition: "top",
            }}
          />
          <figcaption style={{ fontWeight: "bold" }}>Hakuna Matata</figcaption>
        </figure>
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
