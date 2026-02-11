#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const EXTENSIONS = [".ts", ".tsx"];

const TYPES_TO_FIX = ["ReactNode", "ChangeEvent", "FC", "PropsWithChildren"];

// Fonction pour parcourir tous les fichiers
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (EXTENSIONS.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Fonction pour fixer les imports
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  content = content.replace(
    /import\s+{([^}]+)}\s+from\s+["']react["']/g,
    (match, imports) => {
      const importList = imports.split(",").map((i) => i.trim());
      const typeImports = importList.filter((i) => TYPES_TO_FIX.includes(i));
      const normalImports = importList.filter((i) => !TYPES_TO_FIX.includes(i));

      let result = "";
      if (typeImports.length) {
        result += `import type { ${typeImports.join(", ")} } from "react";`;
      }
      if (normalImports.length) {
        result += `\nimport { ${normalImports.join(", ")} } from "react";`;
      }
      changed = true;
      return result;
    }
  );

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated:", filePath);
  }
}

// Exécuter sur tous les fichiers
const files = walk(ROOT_DIR);
files.forEach(fixFile);

console.log("✅ Tous les imports de types ont été mis à jour.");
