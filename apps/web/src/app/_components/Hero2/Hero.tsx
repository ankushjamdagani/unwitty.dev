import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

import "./Hero.styles.css";

const image = {
  src: "/images/profile.jpg",
  alt: "Not me faking meditation",
  width: 200,
  height: 300,
};

export function Hero() {
  return (
    <section id="container-hero">
      <h1>Ankush J.</h1>

      <div className="seperator-rect"></div>

      <p className="pseudo-name">
        a.k.a. <strong>Unwitty[.]Dev</strong>
      </p>

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
        {image && (
          <figure className="rotating-hero-image">
            <Image {...image} alt={image.alt} />
            <figcaption>{image.alt}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
