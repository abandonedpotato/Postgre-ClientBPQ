import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  // This hook copies _redirects to /dist after build
  closeBundle: () => {
    const src = resolve(__dirname, "public/_redirects");
    const dest = resolve(__dirname, "dist/_redirects");
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }
});