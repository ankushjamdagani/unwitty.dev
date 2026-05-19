"use client";

import { Ring } from "./Ring";
import { useWaveAnimation } from "./useWaveAnimation";

export type Choice = "work" | "life";

type CompositionProps = {
  hover: Choice | null;
  selected: Choice | null;
  onHover: (which: Choice | null) => void;
  onSelect: (which: Choice) => void;
  copy: { work: string; life: string };
};

const LABEL_TRANSITION =
  "[transition:transform_0.35s_cubic-bezier(0.2,0.8,0.2,1),letter-spacing_0.35s_ease,opacity_0.25s_ease]";

function Annotations({ hover }: { hover: Choice | null }) {
  const topActive = hover === "work";
  const botActive = hover === "life";
  return (
    <>
      <Anno pos="top-[16%] left-[6%]" active={topActive}>
        DESIGN_SYSTEMS
        <Lead />
      </Anno>
      <Anno pos="top-[12%] -right-[7%] text-right" active={topActive}>
        <Lead />
        PERFORMANCE_OPTIMIZATION
      </Anno>
      <Anno pos="bottom-[17%] right-[2%] text-right" active={botActive}>
        <Lead />
        SLOW_MORNINGS
      </Anno>
      <Anno pos="bottom-[14%] left-[6%]" active={botActive}>
        HAKUNA_MATATA
      </Anno>
    </>
  );
}

function Anno({
  pos,
  active,
  children,
}: {
  pos: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`absolute ${pos} pointer-events-none z-[4] font-mono-display text-xxs font-normal leading-[1.2] tracking-[0.18em] uppercase transition-[color,opacity] duration-[250ms] max-[680px]:text-[9px] ${
        active ? "text-fg" : "text-fg-muted"
      }`}
    >
      {children}
    </span>
  );
}

function Lead() {
  return <span className="mx-[6px] inline-block text-fg-subtle">·</span>;
}

function Label({
  which,
  copy,
  hover,
}: {
  which: Choice;
  copy: string;
  hover: Choice | null;
}) {
  const isWork = which === "work";
  const numText = isWork ? "01 /" : "02 /";
  const active = hover === which;
  const dimmed = hover !== null && hover !== which;

  const base = `absolute left-0 right-0 text-center z-[4] text-fg ${LABEL_TRANSITION}`;
  const work =
    "top-[32%] font-mono-display font-medium leading-none tracking-[0.04em] text-display-sm";
  const life =
    "top-[61%] italic font-light font-serif-display leading-none tracking-[-0.02em] text-display-md";

  const transform = isWork
    ? active
      ? "scale-[1.04] tracking-[0.06em]"
      : ""
    : active
      ? "scale-[1.03]"
      : "";
  const opacity = dimmed ? "opacity-[0.32]" : "";

  return (
    <div className={`${base} ${isWork ? work : life} ${transform} ${opacity}`}>
      <span
        className={`align-middle font-mono-display tracking-[0.04em] text-fg-muted italic mr-[1em] text-lg`}
      >
        {numText}
      </span>
      {copy}
    </div>
  );
}

function Enter({ which, hover }: { which: Choice; hover: Choice | null }) {
  const isWork = which === "work";
  const active = hover === which;
  const pos = isWork ? "top-[25%]" : "top-[75%]";
  const restingTransform = isWork ? "translate-y-[8px]" : "-translate-y-[8px]";
  return (
    <div
      className={`absolute left-0 right-0 text-center font-mono-display text-[10.5px] font-normal leading-none tracking-[0.32em] uppercase text-fg-muted pointer-events-none z-[4] transition-[opacity,transform] duration-[250ms] ${pos} ${
        active
          ? "opacity-[0.85] translate-y-0"
          : `opacity-0 ${restingTransform}`
      }`}
    >
      ↵ {isWork ? "ENTER PROFESSIONAL" : "ENTER PERSONAL"}
    </div>
  );
}

function Zone({
  which,
  onHover,
  onSelect,
  ariaLabel,
}: {
  which: Choice;
  onHover: (which: Choice | null) => void;
  onSelect: (which: Choice) => void;
  ariaLabel: string;
}) {
  const vert = which === "work" ? "-top-[6%] h-[56%]" : "-bottom-[6%] h-[56%]";
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onMouseEnter={() => onHover(which)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(which)}
      onClick={() => onSelect(which)}
      className={`absolute -left-[6%] -right-[6%] ${vert} z-[5] cursor-pointer appearance-none border-0 bg-transparent p-0 m-0 font-[inherit] text-inherit outline-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-dashed focus-visible:outline-ink-3 focus-visible:[outline-offset:-6px]`}
    />
  );
}

export function Composition({
  hover,
  selected,
  onHover,
  onSelect,
  copy,
}: CompositionProps) {
  const { wave, echo } = useWaveAnimation(hover === "life" && !selected);
  const workActive = hover === "work" && !selected;
  const lifeActive = hover === "life" && !selected;

  const selTransform =
    selected === "work"
      ? "translate-y-[80px] scale-[0.86]"
      : selected === "life"
        ? "-translate-y-[80px] scale-[0.86]"
        : "";

  return (
    <div
      className={`relative aspect-square w-[min(680px,68vmin)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${selTransform}`}
    >
      <Ring
        wavePath={wave}
        waveEchoPath={echo}
        workActive={workActive}
        lifeActive={lifeActive}
      />
      <div className="absolute left-[8%] right-[8%] top-1/2 z-[3] h-px -translate-y-[0.5px] bg-fg opacity-70"></div>

      <Annotations hover={hover} />

      <Label which="work" copy={copy.work} hover={hover} />
      <Label which="life" copy={copy.life} hover={hover} />

      <Enter which="work" hover={hover} />
      <Enter which="life" hover={hover} />

      <Zone
        which="work"
        onHover={onHover}
        onSelect={onSelect}
        ariaLabel="ENTER PROFESSIONAL"
      />
      <Zone
        which="life"
        onHover={onHover}
        onSelect={onSelect}
        ariaLabel="ENTER PERSONAL"
      />
    </div>
  );
}
