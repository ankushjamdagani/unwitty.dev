import { Words } from "./_components/Words";
import { Footer } from "./_components/Footer";
import { Info } from "./_components/Info";
import { Nav } from "./_components/Nav";
import { Projects } from "./_components/Projects";
import { Work } from "./_components/Work";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <Nav />
        <Info />
      </section>
      <Projects />
      <Words />
      <Work />
      <Footer />
    </main>
  );
}
