import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import browserslistToEsbuild from "browserslist-to-esbuild";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: browserslistToEsbuild(),
  },
});
