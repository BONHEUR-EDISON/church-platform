// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // <-- c’est ici que Vite va générer le dossier
    emptyOutDir: true
  },
  root: "./" // assure-toi que c’est bien apps/web si config spécifique
});
