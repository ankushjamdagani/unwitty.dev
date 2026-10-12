import type { Product } from "@/config/types";

import { ProductIcon } from "./ProjectsReel/ProductIcon";

/** "The suite": one chip per product, plus an empty slot for what's next. */
export function SuiteStrip({ products }: { products: Product[] }) {
  return (
    <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.06] pt-4">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-subtle">The suite</span>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {products.map((product) => (
          <li key={product.slug}>
            <a
              href={`#projects/${product.slug}`}
              className="inline-flex items-center gap-2 rounded-[10px] bg-surface py-1.5 pl-1.5 pr-2.5 text-[12.5px] font-medium shadow-[0_0_0_1px_rgb(0_0_0/0.07)] transition-shadow hover:shadow-hairline"
            >
              <ProductIcon {...product} size={22} />
              {product.name}
            </a>
          </li>
        ))}
        <li className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-line/[0.15] py-1.5 pl-1.5 pr-2.5 text-[12.5px] text-fg-subtle">
          <span aria-hidden className="size-[22px] rounded-md border border-dashed border-line/[0.18]" />
          Next on the bench
        </li>
      </ul>
    </div>
  );
}
