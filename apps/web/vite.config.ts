import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   root: path.resolve(__dirname, "apps/web"),
  plugins: [react()],
build: {
  outDir: "dist", // Vercel détectera apps/web/dist
  emptyOutDir: true
},

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
