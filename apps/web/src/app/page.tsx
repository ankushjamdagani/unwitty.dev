import { Words } from "./_components/Words";
import { Hero } from "./_components/Hero";
import { Projects } from "./_components/Projects";
import { MarqueeText } from "./_components/MarqueeText";
import { SceneNightLighthouse } from "@/components/SceneNightLighthouse";

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeText />
      <Projects />
      <Words />

      <SceneNightLighthouse />
    </main>
  );
}
