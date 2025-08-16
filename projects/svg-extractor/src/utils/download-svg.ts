type TProps = {
  pathLines: string[];
  w: number;
  h: number;
};

export default function downloadSvg({ pathLines, w, h }: TProps) {
  if (!pathLines.length) return;
  const paths = pathLines
    .map(
      (d: string) =>
        `<path d="${d}" fill="none" stroke="#6be675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join("");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${paths}
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "median-paths.svg";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
