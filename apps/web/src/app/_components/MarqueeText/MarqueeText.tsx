import "./MarqueeText.styles.css";

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
  return (
    <div id="marquee-text-wrapper">
      <div className="marquee-text marquee-text-primary">
        <ul>
          {words.map((word, index) => (
            <li key={word + index} className="word">
              {word}
            </li>
          ))}
        </ul>
        <ul aria-hidden>
          {words.map((word, index) => (
            <li key={word + index} className="word">
              {word}
            </li>
          ))}
        </ul>
      </div>
      <div className="marquee-text marquee-text-secondary">
        <ul>
          {words.map((word, index) => (
            <li key={word + index} className="word">
              {word}
            </li>
          ))}
        </ul>
        <ul aria-hidden>
          {words.map((word, index) => (
            <li key={word + index} className="word">
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
