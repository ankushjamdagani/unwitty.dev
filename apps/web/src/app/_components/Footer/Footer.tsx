import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/configs/constants";

const SayHelloLink = () => (
  <Link
    href="mailto:hello@unwitty.dev"
    className="relative text-center text-5xl font-display font-bold tracking-wider leading-tight text-white hover:text-white/90 transition-all duration-300 flex items-center gap-3"
  >
    Say Hi
  </Link>
);

const SocialIcons: Record<string, React.ReactNode> = {
  GitHub: <FaGithub size={18} />,
  "X (Twitter)": <FaXTwitter size={18} />,
  LinkedIn: <FaLinkedinIn size={18} />,
  Email: <FaRegEnvelope size={18} />,
};

const Socials = () => {
  const labelsMap: Record<string, string> = {
    GitHub: "GIT",
    "X (Twitter)": "X",
    LinkedIn: "LNK",
    Email: "MSG",
  };

  return (
    <div className="relative flex items-center justify-center gap-5 mix-blend-difference py-3 px-6 ">
      {SOCIAL_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-11 w-11 items-center justify-center rounded-md bg-white/[0.03] transition-all duration-300"
          aria-label={link.label}
        >
          {/* Inner icon */}
          <span className="relative z-10 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white">
            {SocialIcons[link.label]}
          </span>

          {/* HUD coordinate/label below */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-white/40 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 pointer-events-none whitespace-nowrap">
            {labelsMap[link.label] || link.label.toUpperCase()}
          </span>
        </Link>
      ))}
    </div>
  );
};

const AstrolabeCircle = () => (
  <div className="flex flex-col items-center gap-12 relative group">
    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center text-white mix-blend-difference">
      <svg viewBox="0 0 400 400" className="absolute inset-0" aria-hidden>
        {/* <circle
          cx="200"
          cy="200"
          r="195"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="0.75"
        /> */}
        {/* <circle
          cx="200"
          cy="200"
          r="178"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        /> */}

        {/* {Array.from({ length: 60 }).map((_, i) => {
          const angle = ((i * 6 - 90) * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const r1 = 178;
          const r2 = isMajor ? 158 : 170;
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * r1}
              y1={200 + Math.sin(angle) * r1}
              x2={200 + Math.cos(angle) * r2}
              y2={200 + Math.sin(angle) * r2}
              stroke="currentColor"
              strokeOpacity={isMajor ? 1 : 0.6}
              strokeWidth={isMajor ? 1.25 : 0.75}
            />
          );
        })} */}

        {/* <circle
          cx="200"
          cy="200"
          r="78"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        /> */}
      </svg>

      <div className="relative flex flex-col items-center gap-4">
        <SayHelloLink />
        <Socials />
      </div>
    </div>
  </div>
);

export function Footer() {
  return (
    <footer id="footer">
      <div
        className="content flex min-h-[75vh] flex-col items-center justify-center gap-10 py-[200px] text-canvas font-technical"
        style={{
          animation: "circles-zoom 1s linear forwards",
          animationRange: "entry 0% entry 99%",
          // @ts-ignore - experimental property
          animationTimeline: "view(block)",
          // @ts-ignore - custom CSS property
          "--ring-width":
            "max(0px, calc((100vmax - var(--transparent-bar-width) - 40px) / 11))",
          background:
            "radial-gradient(circle at var(--circle-x) var(--circle-y), transparent 0px, transparent var(--transparent-bar-width), transparent calc(var(--transparent-bar-width) + 8px), rgb(var(--fg-contrast)) calc(var(--transparent-bar-width) + 8px), rgb(var(--fg-contrast)) calc(var(--transparent-bar-width) + 8px + var(--ring-width)), transparent calc(var(--transparent-bar-width) + 8px + var(--ring-width)), transparent calc(var(--transparent-bar-width) + 16px + var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 75%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 16px + var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 75%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 16px + 2 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 16px + 2 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 24px + 2 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 50%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 24px + 2 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 50%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 24px + 3 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 24px + 3 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 32px + 3 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 25%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 32px + 3 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 25%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 32px + 4 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 32px + 4 * var(--ring-width)), transparent calc(var(--transparent-bar-width) + 40px + 4 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 12%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 40px + 4 * var(--ring-width)), color-mix(in srgb, rgb(var(--fg-contrast)) 12%, rgb(var(--canvas))) calc(var(--transparent-bar-width) + 40px + 5 * var(--ring-width)), rgb(var(--canvas)) calc(var(--transparent-bar-width) + 40px + 5 * var(--ring-width)))",
        }}
      >
        <AstrolabeCircle />
      </div>
    </footer>
  );
}
