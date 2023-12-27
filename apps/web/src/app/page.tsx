import { Words } from "./_components/Words";
import { Footer } from "./_components/Footer";
import { Info } from "./_components/Info";
import { Nav } from "./_components/Nav";
import { Projects } from "./_components/Projects";
import { Work } from "./_components/Work";
import { MarqueeText } from "./_components/MarqueeText";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <Nav />
        <Info />
      </section>
      <MarqueeText />
      <Projects />
      <Words />
      <Work />
      <Footer />
    </main>
  );
}
