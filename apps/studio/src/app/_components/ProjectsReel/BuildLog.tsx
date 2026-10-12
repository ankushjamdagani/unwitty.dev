import type { ProductWithLog } from "@/lib/data";
import { formatDay } from "@/lib/format";

const LATEST = 4;

export function BuildLog({ product }: { product: ProductWithLog }) {
  const entries = product.log.slice(0, LATEST);

  return (
    <div className="min-w-0 flex-[1_1_100%] px-2 pt-1">
      <div className="flex items-baseline justify-between gap-2 border-b border-line/[0.08] pb-2.5">
        <h3 className="m-0 text-[13px] font-semibold">Build log · {product.name}</h3>
        <span className="font-mono text-[11px] opacity-60">
          {product.log.length} {product.log.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      {entries.length ? (
        <ol className="m-0 list-none p-0">
          {entries.map((entry, i) => (
            <li
              key={`${entry.version}-${i}`}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line/[0.06] py-3"
            >
              <span className="flex-[0_0_130px] text-[12px] opacity-60">
                {entry.date ? formatDay(entry.date) : "In progress"}
              </span>
              <span className="min-w-0 flex-[1_1_360px]">
                <span className="font-medium">{entry.kind}</span>{" "}
                <span className="opacity-70">— {entry.text}</span>
              </span>
              <span className="rounded-[5px] bg-white/70 px-1.5 py-0.5 font-mono text-[11px] shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
                {entry.date ? `v${entry.version}` : entry.version}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="m-0 py-3 text-[13px] opacity-60">The log is being written.</p>
      )}
    </div>
  );
}
