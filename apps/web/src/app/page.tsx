import { Words } from "./_components/Words";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { Nav } from "./_components/Nav";
import { Projects } from "./_components/Projects";
import { MarqueeText } from "./_components/MarqueeText";
import { SceneNightLighthouse } from "@/components/SceneNightLighthouse";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <MarqueeText />
      <Projects />
      <Words />
      {/* <Work /> */}
      <Footer />

      <SceneNightLighthouse />
    </main>
  );
}
