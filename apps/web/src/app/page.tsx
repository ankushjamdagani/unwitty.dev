import { Blogs } from "./_components/Blogs";
import { Footer } from "./_components/Footer";
import { Info } from "./_components/Info";
import { Nav } from "./_components/Nav";
import { Projects } from "./_components/Projects";
import { Work } from "./_components/Work";

export default function Home() {
  return (
    <main>
      <Nav />
      <Info />
      <Projects />
      <Blogs />
      <Work />
      <Footer />
    </main>
  );
}
