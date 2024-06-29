import { Words } from "./_components/Words";
// import { Hero } from "./_components/Hero";
import { Hero } from "./_components/Hero2";
import { Projects } from "./_components/Projects";
import { MarqueeText } from "./_components/MarqueeText";
import { SceneNightLighthouse } from "@/components/SceneNightLighthouse";
import { SceneTest } from "@/components/SceneTest";
import { Work } from "./about/_components/Work";

export default function Home() {
  return (
    <main>
      {/* <SceneTest /> */}
      {/* <SceneNightLighthouse /> */}

      <Hero />
      <MarqueeText />
      <Projects />
      <Words />
      <Work />
    </main>
  );
}
