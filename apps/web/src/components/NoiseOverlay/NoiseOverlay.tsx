export function NoiseOverlay() {
  return (
    <div
      id="noise-overlay"
      className="z-above-all pointer-events-none fixed inset-0 opacity-40 mix-blend-color-dodge after:animate-[noise_90ms_infinite] after:absolute after:inset-0 after:z-normal after:bg-[url(/images/noise-web.webp)] after:bg-[length:440px] after:content-['']"
    ></div>
  );
}
