"use client";

import { useState } from "react";
import type { ProductWithLog } from "@/lib/data";
import { formatDay } from "@/lib/format";

const LATEST = 4;

function KindBadge({ kind }: { kind: string }) {
  const normalized = kind.toLowerCase();

  let color = "bg-line/[0.04] text-fg-muted border-line/10";
  if (normalized === "added") {
    color = "bg-emerald-500/10 text-emerald-800 border-emerald-500/20";
  } else if (normalized === "changed") {
    color = "bg-sky-500/10 text-sky-800 border-sky-500/20";
  } else if (normalized === "fixed") {
    color = "bg-amber-500/10 text-amber-800 border-amber-500/20";
  } else if (normalized === "removed" || normalized === "deprecated") {
    color = "bg-rose-500/10 text-rose-800 border-rose-500/20";
  }

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border ${color}`}
    >
      {kind}
    </span>
  );
}

export function BuildLog({ product }: { product: ProductWithLog }) {
  const [expanded, setExpanded] = useState(false);
  const totalEntries = product.log.length;
  const entries = expanded ? product.log : product.log.slice(0, LATEST);

  return (
    <div className="min-w-0 flex-[1_1_100%] px-2 pt-1">
      <div className="flex items-baseline justify-between gap-2 border-b border-line/[0.08] pb-2.5">
        <h3 className="m-0 text-[13px] font-semibold">Build log · {product.name}</h3>
        <div className="flex items-center gap-2 font-mono text-[11px] opacity-60">
          <span>
            {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
          </span>
          {product.changelogUrl && (
            <>
              <span aria-hidden>·</span>
              <a
                href={product.changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-100"
              >
                full changelog <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </>
          )}
        </div>
      </div>
      {entries.length ? (
        <>
          <ol className="m-0 list-none p-0">
            {entries.map((entry, i) => {
              const isUnreleased =
                !entry.date || entry.version.toLowerCase() === "unreleased";

              return (
                <li
                  key={`${entry.version}-${i}`}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-line/[0.06] py-3 text-[13px]"
                >
                  <span className="flex-[0_0_110px] text-[12px]">
                    {entry.date ? (
                      <span className="opacity-60">{formatDay(entry.date)}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-emerald-600 animate-pulse"
                          aria-hidden
                        />
                        Upcoming
                      </span>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-[1_1_340px] items-baseline gap-2">
                    <span className="shrink-0">
                      <KindBadge kind={entry.kind} />
                    </span>
                    <span className="min-w-0 opacity-80 leading-snug">
                      {entry.text}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-[5px] px-1.5 py-0.5 font-mono text-[11px] ${
                      isUnreleased
                        ? "border border-dashed border-line/15 bg-line/[0.03] text-fg-muted"
                        : "bg-surface font-medium text-fg shadow-[0_0_0_1px_rgb(0_0_0/0.08)]"
                    }`}
                  >
                    {isUnreleased ? "Staged" : `v${entry.version}`}
                  </span>
                </li>
              );
            })}
          </ol>
          {totalEntries > LATEST && (
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="font-mono text-[11px] text-fg-muted underline underline-offset-4 transition-colors hover:text-fg"
              >
                {expanded
                  ? "Show fewer entries"
                  : `Show all ${totalEntries} entries ▾`}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="m-0 py-3 text-[13px] opacity-60">The log is being written.</p>
      )}
    </div>
  );
}
