/* Embute as fontes do Google dentro do app (pasta www/fontes/), para o app não
   fazer nenhuma conexão externa ao abrir. Roda na compilação (GitHub Actions),
   depois de "npm run build:www". As fontes (Nunito, Baloo 2, Fredoka) têm
   licença SIL Open Font License, que permite embutir no app. */
const fs = require('fs');
const path = require('path');

const WWW = path.join(__dirname, '..', 'www');
const DESTINO = path.join(WWW, 'fontes');
// navegador moderno: o Google entrega woff2
const UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
const RE_LINK = /<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"[^>]*>/g;
const RE_PRECONNECT = /<link[^>]+rel="preconnect"[^>]+href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\s*/g;

async function baixar(url, binario, buscar) {
  const r = await buscar(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('Falha ao baixar ' + url + ' (' + r.status + ')');
  return binario ? Buffer.from(await r.arrayBuffer()) : r.text();
}

async function embutir(buscar = fetch) {
  fs.mkdirSync(DESTINO, { recursive: true });
  const cssLocal = new Map(); // url do Google -> arquivo css local
  let n = 0;
  for (const nome of fs.readdirSync(WWW).filter(f => f.endsWith('.html'))) {
    const arq = path.join(WWW, nome);
    let html = fs.readFileSync(arq, 'utf8');
    const urls = [...html.matchAll(RE_LINK)].map(m => m[1].replace(/&amp;/g, '&'));
    if (!urls.length && !RE_PRECONNECT.test(html)) continue;
    RE_PRECONNECT.lastIndex = 0;
    for (const url of urls) {
      if (!cssLocal.has(url)) {
        let css = await baixar(url, false, buscar);
        const fontes = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)\s'"]+/g) || [])];
        for (const f of fontes) {
          const local = 'f' + (++n) + path.extname(new URL(f).pathname);
          fs.writeFileSync(path.join(DESTINO, local), await baixar(f, true, buscar));
          css = css.split(f).join(local);
        }
        const familia = (decodeURIComponent(url).match(/family=([^:&]+)/) || [, 'fonte'])[1].replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
        const cssNome = familia + '.css';
        fs.writeFileSync(path.join(DESTINO, cssNome), css);
        cssLocal.set(url, 'fontes/' + cssNome);
        console.log('  ' + familia + ': ' + fontes.length + ' arquivo(s)');
      }
    }
    html = html.replace(RE_PRECONNECT, '').replace(RE_LINK, (tag, u) => '<link rel="stylesheet" href="' + cssLocal.get(u.replace(/&amp;/g, '&')) + '">');
    fs.writeFileSync(arq, html);
    console.log('✓ ' + nome);
  }
  // conferência final: nenhum arquivo do app pode apontar para o Google Fonts
  const sobrou = fs.readdirSync(WWW).filter(f => /\.(html|css|js)$/.test(f))
    .filter(f => /fonts\.(googleapis|gstatic)\.com/.test(fs.readFileSync(path.join(WWW, f), 'utf8')));
  if (sobrou.length) throw new Error('Ainda há fontes externas em: ' + sobrou.join(', '));
  console.log('Fontes embutidas em www/fontes/');
}

if (require.main === module) embutir().catch(e => { console.error(e.message); process.exit(1); });
module.exports = { embutir };
