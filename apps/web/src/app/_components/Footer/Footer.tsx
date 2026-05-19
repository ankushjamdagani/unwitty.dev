import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer id="footer">
      <blockquote className="border-0 border-t border-dashed border-fg-contrast text-xs py-4 text-center">
        “Art is the elimination of the unnecessary.” - Pablo Picasso
      </blockquote>
      <div
        className="content flex min-h-[75vh] flex-col items-center justify-center gap-8 py-[200px] text-canvas-contrast"
        style={{
          animation: "circles-zoom 1s linear forwards",
          animationRange: "entry 0% entry 99%",
          // @ts-ignore - experimental property
          animationTimeline: "view(block)",
          background:
            "repeating-radial-gradient(circle at var(--circle-x) var(--circle-y), transparent, transparent var(--transparent-bar-width), rgb(var(--fg-contrast)) var(--transparent-bar-width), rgb(var(--fg-contrast)) calc((var(--transparent-bar-width) + var(--black-bar-width))))",
        }}
      >
        <Link href="email:#" className="text-[2em]">
          hello@unwitty.dev
        </Link>
        <ul className="flex gap-2">
          <li>
            <Link
              href="#"
              className="border-canvas-contrast hover:bg-canvas-contrast hover:text-fg-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              <FaGithub />
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="border-canvas-contrast hover:bg-canvas-contrast hover:text-fg-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              <FaXTwitter />
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="border-canvas-contrast hover:bg-canvas-contrast hover:text-fg-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              <FaLinkedinIn />
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="border-canvas-contrast hover:bg-canvas-contrast hover:text-fg-contrast flex h-7 w-7 items-center justify-center rounded border-thin transition-colors"
            >
              <FaRegEnvelope />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
