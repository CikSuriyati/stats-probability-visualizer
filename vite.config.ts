import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Served at the domain root. For GitHub Pages under a repo subpath,
  // change this to "/stats-probability-visualizer/" and align the
  // GoatCounter path in index.html accordingly.
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
