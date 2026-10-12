const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-12" → "Dec 2025", "2017" → "2017", null → "Now". */
export function formatYearMonth(value: string | null): string {
  if (!value) return "Now";
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : (year ?? value);
}

/** "2026-10-08" → "Oct 8, 2026". */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}
