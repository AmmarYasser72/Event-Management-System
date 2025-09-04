// frontend/vite.config.js
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  // Dev-only: proxy /api -> backend:5000 so you can use relative URLs
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },

  // When you run `vite preview`
  preview: {
    port: 5173,
    strictPort: true,
    headers: {
      "Cache-Control": "no-store",
    },
  },

  // Build settings (Vercel expects dist/)
  build: {
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
});
