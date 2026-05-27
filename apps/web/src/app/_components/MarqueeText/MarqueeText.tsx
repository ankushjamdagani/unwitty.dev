import React from "react";

const words = [
  "Senior Fullstack Engineer",
  "Product Builder",
  "Open Source Contributor",
  "Technical Lead",
  "Systems Architect",
  "Senior Fullstack Engineer",
  "Creative Technologist",
];

// Combining SVG filter and CSS drop-shadow to match the Welcome screen's Ring aesthetic
const combinedFilterStyle = {
  filter:
    "url(#ledger-rough) drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 0px) 0px rgb(var(--ledger-outline) / 0.4))",
};

const borderAnimationStyle = (direction: string) => ({
  backgroundImage: `linear-gradient(to right, currentColor 50%, transparent 50%), linear-gradient(to right, currentColor 50%, transparent 50%)`,
  backgroundSize: "20px 1.5px, 20px 1.5px",
  backgroundPosition: "0 0, 0 100%",
  backgroundRepeat: "repeat-x",
  animation: "marquee-border 0.3s linear infinite " + direction,
});

export function MarqueeText() {
  const listItems = (
    <ul className="animate-marquee flex min-w-full flex-shrink-0 gap-8 py-2 mr-10">
      {words.map((word, index) => (
        <li
          key={word + index}
          className="after:bg-fg-contrast relative after:absolute after:right-[-18px] after:top-[12px] after:aspect-square after:w-[4px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
        >
          {word}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      id="marquee-text-wrapper"
      className="h-marquee w-full whitespace-nowrap overflow-visible py-4"
    >
      {/* Primary Marquee Bar */}
      <div className="z-normal relative flex -rotate-[1.2deg] origin-right overflow-hidden select-none">
        {/* Animated Rough Border Layer */}
        <div
          className="absolute inset-0 bg-canvas opacity-90 border-y-0"
          style={{
            ...combinedFilterStyle,
            ...borderAnimationStyle("reverse"),
          }}
        />

        {/* Clean Text Layer */}
        <div className="relative z-base w-full flex">
          {listItems}
          <div aria-hidden className="flex">
            {listItems}
          </div>
        </div>
      </div>

      {/* Ghost/Secondary Marquee Bar */}
      <div className="relative flex rotate-[1.2deg] origin-right overflow-hidden select-none [&>ul]:direction-reverse mt-2">
        {/* Animated Border Layer */}
        <div
          className="absolute inset-0 bg-canvas/50 border-fg-muted/30 opacity-20 border-y-0"
          style={borderAnimationStyle("normal")}
        />

        {/* Clean Text Layer */}
        <div className="relative z-base w-full flex opacity-20">
          <ul className="animate-marquee flex min-w-full flex-shrink-0 gap-8 py-2 [animation-direction:reverse]">
            {words.map((word, index) => (
              <li
                key={word + index}
                className="after:bg-fg-muted/50 relative after:absolute after:right-[-18px] after:top-[12px] after:aspect-square after:w-[4px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
              >
                {word}
              </li>
            ))}
          </ul>
          <div aria-hidden className="flex">
            <ul className="animate-marquee flex min-w-full flex-shrink-0 gap-8 py-2 [animation-direction:reverse]">
              {words.map((word, index) => (
                <li
                  key={word + index}
                  className="after:bg-fg-muted/50 relative after:absolute after:right-[-18px] after:top-[12px] after:aspect-square after:w-[4px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
