import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaRegEnvelope,
} from "react-icons/fa6";

import { AnimatedWordList } from "@/components/AnimatedWordList";
import { Time } from "@/components/Time";

import "./Hero.styles.css";

export function Hero() {
  return (
    <section id="hero" className="--left-aligned">
      <h1>
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

      <ul>
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

      <footer>
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
