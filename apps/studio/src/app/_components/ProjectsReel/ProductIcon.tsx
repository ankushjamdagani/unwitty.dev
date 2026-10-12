import type { Product } from "@/config/types";

type Props = Pick<Product, "name" | "icon" | "monogram" | "brand"> & { size?: number };

export function ProductIcon({ name, icon, monogram, brand, size = 28 }: Props) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center font-mono text-[10px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.12)]"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.27), background: brand.accent }}
    >
      {icon === "canvas-one" ? (
        <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 48 48">
          <path d="M17 6 H31 A11 11 0 0 1 42 17 V31 A11 11 0 0 1 31 42 H6 V17 A11 11 0 0 1 17 6 Z" fill="#FFFFFF" />
          <circle cx="18" cy="22" r="4.2" fill={brand.accent} />
          <circle cx="30" cy="22" r="4.2" fill={brand.accent} />
        </svg>
      ) : (
        (monogram ?? name.slice(0, 2).toUpperCase())
      )}
    </span>
  );
}
