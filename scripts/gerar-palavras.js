// Gera palavras-termo.js a partir da lista pública fserb/pt-br (licença MIT).
//   lexico = léxico do português (usado como lista de PALPITES válidos)
//   icf    = raridade das palavras (menor = mais comum; usado para escolher RESPOSTAS)
//   conjugações = formas verbais (anula, falou...) -> também são PALPITES válidos
//   plurais = lexico + s/es (gatos, mares...) -> também são PALPITES válidos
//   listas/negativas = palavras vulgares/ofensivas (nunca viram RESPOSTA)
//   Respostas também descartam palavras com k, w, y (quase sempre estrangeirismos/nomes)
// Uso: node scripts/gerar-palavras.js
// Teste offline: LEXICO_PATH=arquivo ICF_PATH=arquivo NEGATIVAS_PATH=arquivo [CONJ_PATH=arquivo] node scripts/gerar-palavras.js
// Se o download falhar, nada é gerado e o jogo continua com as listas embutidas.
const fs = require('fs');

const BASE = 'https://raw.githubusercontent.com/fserb/pt-br/master/';
const N_RESPOSTAS = Number(process.env.N_RESPOSTAS || 1500);
const OUT = 'palavras-termo.js';

async function ler(nome, caminhoLocal) {
  if (caminhoLocal) return fs.readFileSync(caminhoLocal, 'utf8');
  const r = await fetch(BASE + nome);
  if (!r.ok) throw new Error(nome + ': HTTP ' + r.status);
  return r.text();
}

const semAcento = w => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const num = t => (t !== undefined && /^-?\d+([.,]\d+)?$/.test(t)) ? parseFloat(t.replace(',', '.')) : NaN;

// Aceita só palavras minúsculas de 5 letras (descarta nomes próprios, siglas e hifenizadas)
function palavra5(tok) {
  if (!tok || !/^[a-zà-ÿ]{5}$/.test(tok)) return null;
  const p = semAcento(tok);
  return /^[a-z]{5}$/.test(p) ? p : null;
}

(async () => {
  try {
    const [lexicoTxt, icfTxt, negTxt] = await Promise.all([
      ler('lexico', process.env.LEXICO_PATH),
      ler('icf', process.env.ICF_PATH),
      ler('listas/negativas', process.env.NEGATIVAS_PATH)
    ]);

    // Formas verbais: opcional (se falhar, só avisa)
    let conjTxt = '';
    try { conjTxt = await ler('conjuga%C3%A7%C3%B5es', process.env.CONJ_PATH); }
    catch (e) { console.warn('::warning::Conjugações indisponíveis (' + e.message + '). Formas verbais podem faltar nos palpites.'); }

    // Palavras vulgares/ofensivas (normalizadas, sem acento): ficam fora das respostas
    const bloqueadas = new Set(negTxt.split('\n').map(l => semAcento(l.trim().toLowerCase())).filter(Boolean));

    // base = formas de dicionário (únicas elegíveis a RESPOSTA)
    const base = new Set();
    const lexTodas = new Set();   // todas as palavras do léxico (qualquer tamanho), sem acento
    for (const linha of lexicoTxt.split('\n')) {
      const tok = linha.trim().split(/[\s,;\t]+/)[0];
      if (!tok) continue;
      if (/^[a-zà-ÿ]+$/.test(tok)) lexTodas.add(semAcento(tok));
      const p = palavra5(tok);
      if (p) base.add(p);
    }

    // validas = base + conjugações + plurais simples
    const validas = new Set(base);
    for (const linha of conjTxt.split('\n')) {
      const p = palavra5(linha.trim().split(/[\s,;\t]+/)[0]);
      if (p) validas.add(p);
    }
    for (const w of lexTodas) {
      if (w.length === 4) validas.add(w + 's');
      else if (w.length === 3 && /[rzs]$/.test(w)) validas.add(w + 'es');
    }

    const score = new Map();
    for (const linha of icfTxt.split('\n')) {
      let t = linha.trim().split(/[\s,;\t]+/);
      if (!isNaN(num(t[0])) && isNaN(num(t[1]))) t = [t[1], t[0]]; // formato "score palavra"
      const p = palavra5(t[0]);
      const s = num(t[1]);
      if (p && !isNaN(s) && base.has(p) && (!score.has(p) || s < score.get(p))) score.set(p, s);
    }

    const respostas = [...score.entries()].filter(e => !bloqueadas.has(e[0]) && !/[kwy]/.test(e[0])).sort((a, b) => a[1] - b[1]).slice(0, N_RESPOSTAS).map(e => e[0]).sort();
    if (base.size < 1000 || respostas.length < 200) {
      throw new Error('Listas muito pequenas (' + validas.size + ' válidas / ' + respostas.length + ' respostas): formato inesperado?');
    }

    const cab = '/* Lista de palavras: fserb/pt-br (https://github.com/fserb/pt-br)\n' +
      ' * Copyright 2021 Fernando Serboncini — MIT License.\n' +
      ' * Aviso de copyright e licença completos em NOTICE-palavras.txt */\n';
    fs.writeFileSync(OUT, cab +
      'window.TERMO_RESPOSTAS="' + respostas.join(' ') + '";\n' +
      'window.TERMO_VALIDAS="' + [...validas].sort().join(' ') + '";\n');
    console.log('OK: ' + respostas.length + ' respostas, ' + validas.size + ' palpites válidos -> ' + OUT);
  } catch (e) {
    console.warn('::warning::Não foi possível gerar ' + OUT + ' (' + e.message + '). O jogo usará as listas embutidas.');
  }
})();
