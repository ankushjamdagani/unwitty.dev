import React from "react";

import "./Info.styles.css";
import { AnimatedWordList } from "@/components/AnimatedWordList";

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
          <strong>
            <AnimatedWordList
              words={[
                <span key={"stupid"}>stupid</span>,
                <span key={"awesome"}>awesome</span>,
              ]}
              transitionTime={2000}
            />
          </strong>
          <br />
          ...
          <strong className="wavy-underline">fun</strong> all the time
        </p>
      </header>

      <a className="btn btn-bordered" href="#">
        Hire me
      </a>
      <ul>
        <li>gt</li>
        <li>tw</li>
        <li>li</li>
        <li>gm</li>
      </ul>
    </section>
  );
}
