import "./MarqueeText.styles.css";

const words = [
  "Furonto endo no kaihatsu-sha",
  "Entwickler für Benutzeroberflächen",
  "sviluppatore Frontend",
  "Frontend Developer",
  "desenvolvedor frontend",
  "Desarrollador frontend",
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
