import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaRegEnvelope,
} from "react-icons/fa6";

import { AnimatedWordList } from "@/components/AnimatedWordList";
import { Time } from "@/components/Time";

export function Hero() {
  return (
    <section
      id="hero"
      className="border-fg-contrast ml-[max(16px,calc((100vw-800px)/2))] relative flex min-h-[calc(100vh-var(--nav-height)-var(--marquee-height)/2)] flex-col items-start justify-center gap-4 border-l-[length:var(--border-width-md)] border-dashed py-16 pl-4 text-left"
    >
      <h1 className="text-[4.5em] leading-[1.15em]">
        Hello <br />
        I&apos;m <b>Ankush</b>
      </h1>

      <div className="seperator-rect"></div>

      <p>
        Crafting web experiences for <strong>7+ years</strong> <br />
        sometimes{" "}
        <AnimatedWordList
          words={["stupid", "awesome"]}
          transitionTime={2500}
          as="strong"
          className="highlight-inverted"
        />
        <br />
        ...
        <strong className="wavy-underline">fun</strong> all the time
      </p>

      <div className="seperator-rect"></div>

      <ul className="flex gap-2">
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaGithub />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaXTwitter />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaLinkedinIn />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaRegEnvelope />
          </Link>
        </li>
      </ul>

      <footer className="text-xs absolute bottom-0 left-0 flex w-full justify-between py-2 pl-0 pr-4">
        <em>
          Based in India →{" "}
          <strong>
            <Time />
          </strong>
        </em>
        <em>
          Status → <strong>Open to Work</strong>
        </em>
      </footer>
    </section>
  );
}
