export function SceneTest() {
  return (
    <div
      id="scene-test"
      className="absolute bottom-0 left-0 right-0 top-[var(--nav-height)]"
    >
      <div
        id="item-sun"
        className="absolute left-[100px] top-[100px] aspect-square w-[50px] rounded-full backdrop-invert after:absolute after:inset-0 after:animate-[scale-fade-out_1s_ease-in-out_infinite] after:rounded-full after:border after:border-solid after:border-fg-contrast after:content-[''] after:backdrop-invert"
      ></div>
      <div
        id="item-tunnel"
        className="bg-fg-contrast absolute bottom-[100px] left-[100px] h-[60px] w-[40px] rounded-t-[50px] after:bg-black after:absolute after:inset-0 after:rounded-t-[50px] after:border after:border-solid after:border-fg-contrast after:content-[''] before:bg-gradient-to-r before:from-foreground before:to-transparent before:absolute before:bottom-0 before:left-[-200px] before:right-[-800px] before:h-[1px] before:content-['']"
      ></div>
      <div
        id="hero-image"
        className="h-[600px] w-[300px] -scale-x-100 bg-[url(/images/crumbled_page.jpg)] bg-cover bg-right grayscale invert"
      ></div>
    </div>
  );
}
