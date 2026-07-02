import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

import { Time } from "@/components/Time";
import { AnimatedWordList } from "@/components/AnimatedWordList";
import { TypeWord, TypeWordCursor } from "@/components/TypeWord";
import { SOCIAL_LINKS, STATUS } from "@/configs/constants";

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

const SocialIcons: Record<string, React.ReactNode> = {
  GitHub: <FaGithub />,
  Twitter: <FaXTwitter />,
  LinkedIn: <FaLinkedinIn />,
  Email: <FaRegEnvelope />,
};

export function Hero() {
  return (
    <section
      id="home"
      className="px-[var(--horizontal-gap)] relative flex min-h-[calc(100vh-var(--nav-height)-var(--marquee-height))] flex-col justify-center gap-4"
    >
      <h1 className="first-letter:bg-fg-contrast first-letter:text-canvas-contrast first-letter:rounded first-letter:mr-1 first-letter:px-3 font-bold">
        Ankush J.
      </h1>

      <p className="pseudo-name border-fg-contrast my-5 mb-3 max-w-[480px] border-y-2 border-dashed py-1 text-[0.85em] italic">
        a.k.a. <strong>Unwitty</strong>.dev
      </p>

      <p className="max-w-[480px]">
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

      <ul className="flex w-full items-start gap-2">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.url}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              {SocialIcons[link.label]}
            </Link>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-0 left-[calc(480px+var(--horizontal-gap)+4em)] top-0 flex w-[300px] flex-col justify-center">
        <figure className="bg-canvas-contrast rounded border-fg-contrast hover:z-base themed-filter p-3 pb-2 text-center transition-[filter,transform] duration-300 [transform:translateY(0px)_translateX(10px)_rotateZ(7deg)_scale(1)] hover:scale-110 hover:[transform:translateY(0px)_translateX(10px)_rotateZ(-4deg)_scale(1.2)] border-2 border-dashed">
          <Image
            alt="Profile Picture"
            height={300}
            src="/images/profile.png"
            width={200}
            className="border-canvas-contrast aspect-[1/1.15] w-full flex-1 rounded border-b-2 object-cover"
            style={{
              objectPosition: "top",
            }}
          />
          <figcaption className="font-bold">Hakuna Matata</figcaption>
        </figure>
      </div>

      <footer className="text-xs absolute bottom-0 left-[var(--horizontal-gap)] right-[var(--horizontal-gap)] flex justify-between py-6">
        <em>
          Based in India →{" "}
          <strong>
            <Time />
          </strong>
        </em>
        <em>
          Status →{" "}
          <AnimatedWordList transitionTime={2000}>
            {STATUS.map((st) => (
              <strong key={st.label}>{st.label.replace(/_/g, " ")}</strong>
            ))}
          </AnimatedWordList>
        </em>
      </footer>
    </section>
  );
}
