import { profile } from "@/config/profile";
import type { Product } from "@/config/types";
import type { HeroUpdate } from "@/lib/hero";

import { DotField } from "./DotField";
import { HeroHeadline } from "./HeroHeadline";
import { StatusTicker } from "./StatusTicker";
import { SuiteStrip } from "./SuiteStrip";

type Props = {
  updates: HeroUpdate[];
  products: Product[];
};

export function Hero({ updates, products }: Props) {
  return (
    <section aria-labelledby="intro" className="relative isolate pb-14 pt-16 sm:pt-24">
      <DotField fade="top" />
      <StatusTicker updates={updates} />
      <div className="mt-5">
        <HeroHeadline />
      </div>
      <p className="m-0 mt-5 max-w-[470px] text-[15px] leading-[1.55] text-fg-body">
        {profile.intro}
        <br />
        <span className="text-fg-subtle">
          <span className="font-medium text-fg-body">{profile.studio}</span> · {profile.studioLine}
        </span>
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="#projects" className="btn-primary">
          See the work <span aria-hidden>↓</span>
        </a>
        <a href="#about" className="btn-secondary">
          About me
        </a>
      </div>
      <SuiteStrip products={products} />
    </section>
  );
}
