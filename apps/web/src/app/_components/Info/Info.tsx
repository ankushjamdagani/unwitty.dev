import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaRegEnvelope,
} from "react-icons/fa6";

import { AnimatedWordList } from "@/components/AnimatedWordList";

import "./Info.styles.css";

export function Info() {
  return (
    <section id="info">
      <header>
        <h1>
          Hello <br />
          I&apos;m Ankush
        </h1>

        <p>
          Crafting web experiences for <strong>7+ years</strong> <br />
          sometimes{" "}
          <AnimatedWordList
            words={["stupid", "awesome"]}
            transitionTime={2500}
            as="strong"
          />
          <br />
          ...
          <strong className="wavy-underline">fun</strong> all the time
        </p>
      </header>

      <a className="btn btn-bordered" href="#">
        Hire me
      </a>
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
    </section>
  );
}
