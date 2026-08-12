const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace from '...' or from "..."
  const fromRegex = /from\s+['"]([^'"]+)['"]/g;
  content = content.replace(fromRegex, (match, p) => {
    if (p.startsWith('.') || p.startsWith('@/')) {
      const parts = p.split('/');
      const basename = parts[parts.length - 1];
      modified = true;
      return `from "./${basename}"`;
    }
    return match;
  });

  // Replace import '...' or import "..."
  const importRegex = /import\s+['"]([^'"]+)['"]/g;
  content = content.replace(importRegex, (match, p) => {
    if (p.startsWith('.') || p.startsWith('@/')) {
      const parts = p.split('/');
      const basename = parts[parts.length - 1];
      modified = true;
      return `import "./${basename}"`;
    }
    return match;
  });

  // Replace import('...') or import("...")
  const dynImportRegex = /import\(['"]([^'"]+)['"]\)/g;
  content = content.replace(dynImportRegex, (match, p) => {
    if (p.startsWith('.') || p.startsWith('@/')) {
      const parts = p.split('/');
      const basename = parts[parts.length - 1];
      modified = true;
      return `import("./${basename}")`;
    }
    return match;
  });
  
  // HTML special case for src="..."
  if (file.endsWith('.html')) {
    const srcRegex = /src=['"]([^'"]+)['"]/g;
    content = content.replace(srcRegex, (match, p) => {
      if (p.startsWith('/') || p.startsWith('.')) {
        const parts = p.split('/');
        const basename = parts[parts.length - 1];
        modified = true;
        return `src="/${basename}"`; // Vite dev server expects root path
      }
      return match;
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Imports flattened.');
