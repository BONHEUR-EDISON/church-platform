import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname), // ou "./" si tu es déjà dans apps/web
  plugins: [react()],
  build: {
    outDir: "dist", // Vite va générer apps/web/dist
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
