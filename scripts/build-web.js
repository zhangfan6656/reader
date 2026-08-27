const fs = require('fs');
const path = require('path');

const root = __dirname + '/..';
const outDir = path.join(root, 'www');
fs.mkdirSync(outDir, { recursive: true });
['index.html', 'manifest.webmanifest', 'sw.js', 'icon.svg'].forEach(f => {
  fs.copyFileSync(path.join(root, f), path.join(outDir, f));
});
console.log('web:build -> copied index.html + PWA assets to www/');
