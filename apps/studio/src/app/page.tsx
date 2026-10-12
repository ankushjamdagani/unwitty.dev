import { activitySwatches, getActivity, getHeroUpdates, getProducts } from "@/lib/data";

import { About } from "./_components/About";
import { Activity } from "./_components/Activity";
import { Hero } from "./_components/Hero";
import { ProjectsReel } from "./_components/ProjectsReel";

// Must be a literal; keep in sync with REVALIDATE_SECONDS in lib/github.ts.
// The hourly latest-commit fetch (fetchLatestCommit) lowers the effective interval to 1h.
export const revalidate = 86400;

export default async function Home() {
  const [products, activity] = await Promise.all([getProducts(), getActivity()]);
  const updates = await getHeroUpdates(products);

  return (
    <>
      <Hero updates={updates} products={products} />
      <ProjectsReel products={products} />
      <Activity
        grid={activity}
        sources={activitySwatches()}
        releases={Object.fromEntries(
          products.map((p) => [p.slug, new Set(p.log.filter((e) => e.date).map((e) => e.version)).size]),
        )}
      />
      <About />
    </>
  );
}
