#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Extensions à traiter
const EXTENSIONS = [".ts", ".tsx"];

// Fonction pour parcourir tous les fichiers du projet
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

// Détecte si un symbole est utilisé dans le fichier
function isUsed(symbol, content) {
  const regex = new RegExp(`\\b${symbol}\\b`, "g");
  return content.match(regex);
}

// Fonction pour corriger les imports
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
      if (!isUsed(i, content)) {
        changed = true; // Supprime l'import non utilisé
        return;
      }

      // Détecte les types (ReactNode, Props, Type, State, interfaces, types personnalisés)
      if (
        /^[A-Z]/.test(i) ||
        /(Props|Type|State|Interface)$/.test(i)
      ) {
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
    return ""; // Ligne vide si tout supprimé
  });

  const newContent = lines.filter(Boolean).join("\n");

  if (changed) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log("✅ Updated:", filePath);
  }
}

// Exécution sur tout le projet
const files = walk(process.cwd());
files.forEach(fixFile);

console.log("\n🎉 Tous les imports ont été corrigés et les imports inutilisés supprimés !");
