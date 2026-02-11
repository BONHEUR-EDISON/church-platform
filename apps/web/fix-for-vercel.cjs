const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'src');

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const fixed = content.replace(
        /import type\s+\{([^\}]+)\}\s+from\s+(['"][^'"]+['"])/g,
        'import {$1} from $2'
      );
      if (fixed !== content) {
        fs.writeFileSync(fullPath, fixed, 'utf-8');
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

fixImports(folder);
console.log('✅ Tous les imports ont été corrigés.');
