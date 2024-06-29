import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import browserslistToEsbuild from "browserslist-to-esbuild";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from "vite-plugin-pwa";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(),
    wasm(),
    topLevelAwait(),
    // VitePWA({
    //   injectRegister: "auto",
    //   registerType: "autoUpdate",
    //   devOptions: {
    //     enabled: true,
    //   },
    // }),
  ],
  build: {
    target: browserslistToEsbuild(),
    emptyOutDir: true,
    sourcemap: true,
  },
});
