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
    <section
      id="container-introduction"
      className="ml-[var(--horizontal-gap)] relative flex flex-col gap-4 pl-4 pt-16"
    >
      <h1 className="text-[4.5em] font-bold">About me</h1>

      <div className="seperator-rect"></div>

      <p className="max-w-[480px]">
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

      <ul className="flex w-full items-start gap-2">
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaGithub />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaXTwitter />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaLinkedinIn />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
          >
            <FaRegEnvelope />
          </Link>
        </li>
      </ul>

      <div className="absolute bottom-0 right-[var(--horizontal-gap)] top-[calc(64px+4em)] w-[300px]">
        <RotatingCards list={Images} />
      </div>
    </section>
  );
}
