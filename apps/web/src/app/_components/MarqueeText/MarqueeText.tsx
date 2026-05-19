const words = [
  "Full-Stack Developer",
  "フルスタック開発者",
  "Desarrollador Full-Stack",
  "Full-Stack Developer",
  "Développeur Full-Stack",
  "Full-Stack-Entwickler",
  "Full-Stack Developer",
  "Sviluppatore Full-Stack",
  "Desenvolvedor Full-Stack",
  "Full-Stack Developer",
  "풀스택 개발자",
  "全栈开发者",
  "Full-Stack Developer",
  "Full-Stack разработчик",
  "مطور فل ستاك",
];

export function MarqueeText() {
  const listItems = (
    <ul className="animate-marquee flex min-w-full flex-shrink-0 gap-8 py-2">
      {words.map((word, index) => (
        <li
          key={word + index}
          className="after:bg-fg-contrast relative after:absolute after:right-[-18px] after:top-[10px] after:aspect-square after:w-[6px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
        >
          {word}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      id="marquee-text-wrapper"
      className="h-marquee w-full whitespace-nowrap"
    >
      <div className="bg-canvas-contrast border-fg-contrast z-normal relative flex -rotate-[1.5deg] origin-right overflow-hidden border-y-[length:var(--border-width-md)] border-dashed opacity-80 transition-transform select-none">
        {listItems}
        <div aria-hidden className="flex">
          {listItems}
        </div>
      </div>
      <div className="bg-canvas-contrast border-fg-contrast relative flex rotate-[1.5deg] origin-right overflow-hidden border-y-[length:var(--border-width-md)] border-dashed opacity-20 transition-transform select-none [&>ul]:direction-reverse">
        <ul className="animate-marquee flex min-w-full flex-shrink-0 gap-8 py-2 [animation-direction:reverse]">
          {words.map((word, index) => (
            <li
              key={word + index}
              className="after:bg-fg-contrast relative after:absolute after:right-[-18px] after:top-[10px] after:aspect-square after:w-[6px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
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
                className="after:bg-fg-contrast relative after:absolute after:right-[-18px] after:top-[10px] after:aspect-square after:w-[6px] after:rotate-45 after:translate-x-[-50%] after:translate-y-[-50%] after:content-['']"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
