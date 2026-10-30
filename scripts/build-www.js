// Copia os arquivos web do Ativamente para ./www (webDir do Capacitor)
const fs = require('fs'), path = require('path');
const OUT = 'www';
const EXT = ['.html', '.css', '.png', '.webp', '.json', '.js', '.woff2'];
const EXTRA = ['NOTICE-palavras.txt'];
const SKIP = ['package.json', 'package-lock.json', 'capacitor.config.json', 'politica-privacidade.html'];
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
let n = 0;
for (const f of fs.readdirSync('.')) {
  if (!fs.statSync(f).isFile() || SKIP.includes(f)) continue;
  if (EXT.includes(path.extname(f).toLowerCase()) || EXTRA.includes(f)) { fs.copyFileSync(f, path.join(OUT, f)); n++; }
}
console.log(n + ' arquivos copiados para ' + OUT);
