import { Introduction } from "./_components/Introduction";
import { Work } from "./_components/Work";

import "./About.styles.css";

export default function Home() {
  return (
    <main id="page-about">
      <Introduction />
      <Work />
    </main>
  );
}
