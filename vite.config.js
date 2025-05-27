import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ttsx.bigpotatoquiz.co.uk',
      'postgre-clientbpq.onrender.com'  
    ],
    host: '0.0.0.0', // Enables LAN access in local dev, safe to leave for Render
    port: 5173,      // Only affects local development, ignored by Render static site
    // You do NOT need hmr, proxy, or clientPort for production static deployment
  },
  build: { outDir: "dist" },
  // This hook copies _redirects to /dist after build
  closeBundle: () => {
    const src = resolve(__dirname, "public/_redirects");
    const dest = resolve(__dirname, "dist/_redirects");
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }
});