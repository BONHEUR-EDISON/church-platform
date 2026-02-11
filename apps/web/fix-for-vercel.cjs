#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const EXTENSIONS = [".ts", ".tsx"];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (EXTENSIONS.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

function isUsed(symbol, content) {
  const regex = new RegExp(`\\b${symbol}\\b`, "g");
  return content.match(regex);
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let lines = content.split("\n");
  let changed = false;

  const importRegex = /^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/;

  lines = lines.map((line) => {
    const match = line.match(importRegex);
    if (!match) return line;

    let [, imports, lib] = match;
    const importList = imports.split(",").map((i) => i.trim());
    const typeImports = [];
    const normalImports = [];

    importList.forEach((i) => {
      if (!isUsed(i, content)) return (changed = true); // supprime non utilisé

      // Détecte les types (ReactNode, Props, Type, State, Interface)
      if (/^(ReactNode|ChangeEvent|Props|Type|State|Interface)$/.test(i)) {
        typeImports.push(i);
      } else {
        normalImports.push(i);
      }
    });

    if (typeImports.length && normalImports.length) {
      changed = true;
      return `import type { ${typeImports.join(", ")} } from "${lib}";\nimport { ${normalImports.join(
        ", "
      )} } from "${lib}";`;
    } else if (typeImports.length) {
      changed = true;
      return `import type { ${typeImports.join(", ")} } from "${lib}";`;
    } else if (normalImports.length) {
      return `import { ${normalImports.join(", ")} } from "${lib}";`;
    }
    return ""; // ligne vide si tout supprimé
  });

  // Corrige TS2322 pour ProtectedRoute
  lines = lines.map((line) =>
    line.includes("allowedRoles") ? line.replace("allowedRoles", "requiredRole") : line
  );

  // Corrige TS1484 pour les types importés
  lines = lines.map((line) =>
    /import { (ReactNode|ChangeEvent)/.test(line)
      ? line.replace("import {", "import type {")
      : line
  );

  const newContent = lines.filter(Boolean).join("\n");

  if (changed || newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log("✅ Updated:", filePath);
  }
}

const files = walk(process.cwd());
files.forEach(fixFile);

console.log("\n🎉 Tous les fichiers TypeScript sont maintenant prêts pour Vercel + Turbo!");
