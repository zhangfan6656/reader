const fs = require('fs');
const path = require('path');

const root = __dirname + '/..';
const outDir = path.join(root, 'www');
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(outDir, 'index.html'));
console.log('web:build -> copied index.html to www/index.html');
