import { profile } from "@/config/profile";

import { DotField } from "./DotField";

export function Hero() {
  return (
    <section
      aria-labelledby="intro"
      className="relative isolate flex flex-wrap items-end justify-between gap-x-12 gap-y-4 pb-14 pt-16 sm:pt-24"
    >
      <DotField fade="top" />
      <h1
        id="intro"
        className="m-0 flex-[1_1_600px] text-[clamp(44px,5.6vw,76px)] font-medium leading-none tracking-[-0.045em]"
      >
        {profile.headline}
      </h1>
      <p className="m-0 font-mono text-[13px] text-fg-subtle">by {profile.name}</p>
    </section>
  );
}
