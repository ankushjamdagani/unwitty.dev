import { profile } from "@/config/profile";
import { splitHeadline } from "@/lib/hero";

/** The headline as words that rise in one after another; the accessible name stays one plain string. */
export function HeroHeadline() {
  const words = splitHeadline(profile.headline, profile.headlineEmphasis);

  return (
    <h1
      id="intro"
      aria-label={profile.headline}
      className="m-0 text-[clamp(44px,5.6vw,76px)] font-medium leading-[0.98] tracking-[-0.045em]"
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          {i > 0 && " "}
          <span
            className={word.emphasis ? "hero-word emphasis" : "hero-word"}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {word.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
