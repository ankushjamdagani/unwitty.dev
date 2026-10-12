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

/** "15:42 IST": 24-hour wall-clock time in `timeZone`, followed by `label`. */
export function formatLocalTime(date: Date, timeZone: string, label: string): string {
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(date);
  return `${time} ${label}`;
}
