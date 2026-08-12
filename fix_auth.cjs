const fs = require('fs');

const files = ['Login.jsx', 'Register.jsx'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import\s+\{\s*safeReturnTo\s*\}\s+from\s+['"].\/authReturnTo['"];?/g, '');
    content = content.replace(/safeReturnTo\(\)/g, 'undefined');
    fs.writeFileSync(f, content);
  }
});
console.log('Fixed safeReturnTo');
