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
import { SOCIAL_LINKS } from "@/configs/constants";

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

const SocialIcons: Record<string, React.ReactNode> = {
  GitHub: <FaGithub />,
  Twitter: <FaXTwitter />,
  LinkedIn: <FaLinkedinIn />,
  Email: <FaRegEnvelope />,
};

export function Introduction() {
  return (
    <section
      id="container-introduction"
      className="px-[var(--horizontal-gap)] relative flex flex-col gap-4 pt-16"
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
        {SOCIAL_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-fg-contrast hover:bg-fg-contrast hover:text-canvas-contrast inline-flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              {SocialIcons[link.label]}
            </Link>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-0 right-[var(--horizontal-gap)] top-[calc(64px+4em)] w-[300px] max-[1200px]:hidden">
        <RotatingCards list={Images} />
      </div>
    </section>
  );
}
