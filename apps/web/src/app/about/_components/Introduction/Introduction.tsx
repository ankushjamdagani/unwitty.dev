import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

import {
  RotatingCards,
  type RotatingCardsItem,
} from "@/components/RotatingCards";

import "./Introduction.styles.css";

const Images: RotatingCardsItem[] = [
  {
    src: "/images/about1.jpeg",
    alt: "Something about image 1",
    width: 200,
    height: 300,
  },
  {
    src: "/images/about2.jpeg",
    alt: "Something about image 2",
    width: 200,
    height: 300,
  },
  {
    src: "/images/about3.jpeg",
    alt: "Something about image 3",
    width: 200,
    height: 300,
  },
];

export function Introduction() {
  return (
    <section id="container-introduction">
      <h1>About me</h1>

      <div className="seperator-rect"></div>

      <p>
        Frontend Developer for 7 years, weaving digital tales and embracing the
        lazy coder&apos;s lifestyle. <br /> <br />
        <strong>❤️ all things Javascript.</strong>
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
        <RotatingCards list={Images} />
      </div>
    </section>
  );
}
