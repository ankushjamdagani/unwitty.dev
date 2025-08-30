import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import comlink from "vite-plugin-comlink";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [comlink(), react(), tailwindcss()],
  worker: {
    plugins: () => [comlink()],
  },
  server: {
    host: true,
    port: 3002,
    strictPort: true,
  },
});
