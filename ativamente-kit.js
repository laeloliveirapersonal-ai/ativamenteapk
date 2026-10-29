/* ==========================================================
   ATIVAMENTE — KIT DOS JOGOS
   Idioma, sons, voz, vibração, confete, progresso e botão
   voltar, iguais em todos os jogos novos da plataforma.
   ========================================================== */
(function () {
  'use strict';
  var AK = {};

  // ---------- Idioma ----------
  AK.lang = (function () {
    var l = '';
    try { l = (window.AtivamenteI18n && AtivamenteI18n.idioma) || localStorage.getItem('ativamente-idioma') || ''; } catch (e) {}
    if (!l) l = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    return ['pt', 'en', 'es'].indexOf(l) >= 0 ? l : 'pt';
  })();
  document.documentElement.lang = { pt: 'pt-BR', en: 'en', es: 'es' }[AK.lang];
  // Escolhe o texto do idioma: AK.t({pt:'..', en:'..', es:'..'})
  AK.t = function (obj) { return obj == null ? '' : (obj[AK.lang] != null ? obj[AK.lang] : obj.pt); };
  // Preenche [data-t="chave"] com textos de um dicionário {chave:{pt,en,es}}
  AK.traduzir = function (dic, raiz) {
    (raiz || document).querySelectorAll('[data-t]').forEach(function (el) {
      var k = el.getAttribute('data-t'); if (dic[k]) el.textContent = AK.t(dic[k]);
    });
  };

  // ---------- Ajustes da plataforma ----------
  AK.ajustes = (function () {
    try { return (window.AtivamenteAjustes && AtivamenteAjustes.ler()) || { som: 'on', anim: 'normal', texto: 'normal' }; }
    catch (e) { return { som: 'on', anim: 'normal', texto: 'normal' }; }
  })();
  AK.somLigado = AK.ajustes.som !== 'off';

  // ---------- Sons (gerados, sem arquivos) ----------
  var ctx = null;
  function audio() {
    if (!AK.somLigado) return null;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { return null; }
    return ctx;
  }
  function nota(freq, ini, dur, tipo, vol) {
    var c = audio(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + ini;
    o.type = tipo || 'sine'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  AK.som = function (tipo) {
    if (tipo === 'ok') { nota(660, 0, 0.12, 'triangle'); nota(990, 0.1, 0.18, 'triangle'); }
    else if (tipo === 'erro') { nota(220, 0, 0.18, 'square', 0.08); nota(170, 0.12, 0.22, 'square', 0.08); }
    else if (tipo === 'vitoria') { [523, 659, 784, 1047].forEach(function (f, i) { nota(f, i * 0.12, 0.25, 'triangle'); }); }
    else if (tipo === 'tique') { nota(880, 0, 0.06, 'sine', 0.12); }
    else if (tipo === 'bip') { nota(1046, 0, 0.18, 'sine', 0.16); }
    else { nota(520, 0, 0.07, 'sine', 0.1); }
  };

  // ---------- Voz ----------
  AK.vozLigada = true;
  AK.falar = function (texto) {
    if (!AK.vozLigada || !AK.somLigado || !window.speechSynthesis || !texto) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[AK.lang];
      var vozes = speechSynthesis.getVoices().filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(AK.lang) === 0; });
      if (vozes.length) u.voice = vozes[0];
      u.rate = 0.95; u.pitch = 1.05;
      speechSynthesis.speak(u);
    } catch (e) {}
  };

  AK.vibrar = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 30); } catch (e) {} };

  // ---------- Telas ----------
  AK.tela = function (id) {
    document.querySelectorAll('.tela').forEach(function (t) { t.classList.toggle('on', t.id === id); });
    AK.telaAtual = id;
    window.scrollTo(0, 0);
  };

  // ---------- Utilidades ----------
  AK.embaralhar = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
  AK.sortear = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  AK.estrelasHTML = function (n, max) {
    var s = ''; for (var i = 0; i < (max || 3); i++) s += '<span class="ak-estrela' + (i < n ? ' on' : '') + '">★</span>'; return s;
  };

  // ---------- Progresso salvo ----------
  AK.salvo = function (jogo) {
    var chave = 'ativamente-' + jogo;
    return {
      ler: function () { try { return JSON.parse(localStorage.getItem(chave) || '{}') || {}; } catch (e) { return {}; } },
      gravar: function (d) { try { localStorage.setItem(chave, JSON.stringify(d)); } catch (e) {} }
    };
  };

  // ---------- Confete ----------
  AK.confete = function () {
    if (AK.ajustes.anim === 'reduzida') return;
    var cores = ['#ff5d8f', '#ffd23f', '#3ec1d3', '#7c6fe0', '#4fc3a1', '#ff9f43'];
    var box = document.createElement('div'); box.className = 'ak-confete';
    for (var i = 0; i < 60; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = cores[i % cores.length];
      p.style.animationDelay = Math.random() * 0.6 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 3400);
  };

  // ---------- Janela de resultado ----------
  // AK.resultado({titulo, estrelas, texto, botoes:[{rotulo, classe, acao}]})
  AK.resultado = function (o) {
    var fundo = document.createElement('div'); fundo.className = 'ak-modal';
    var html = '<div class="ak-modal-card" role="dialog" aria-modal="true">';
    if (o.estrelas != null) html += '<div class="ak-estrelas-grandes">' + AK.estrelasHTML(o.estrelas) + '</div>';
    html += '<h2>' + (o.titulo || '') + '</h2>';
    if (o.texto) html += '<div class="ak-modal-texto">' + o.texto + '</div>';
    html += '<div class="ak-modal-botoes"></div></div>';
    fundo.innerHTML = html;
    var caixa = fundo.querySelector('.ak-modal-botoes');
    (o.botoes || []).forEach(function (b) {
      var bt = document.createElement('button'); bt.type = 'button';
      bt.className = 'ak-btn ' + (b.classe || ''); bt.textContent = b.rotulo;
      bt.onclick = function () { fundo.remove(); AK.modalAberto = null; if (b.acao) b.acao(); };
      caixa.appendChild(bt);
    });
    document.body.appendChild(fundo);
    AK.modalAberto = fundo;
    if (o.estrelas >= 2) { AK.som('vitoria'); AK.confete(); }
    return fundo;
  };

  // ---------- Botão voltar (Android e botão ← da plataforma) ----------
  // O jogo informa como voltar uma tela: AK.voltarInterno = function(){ ...; return true se tratou }
  AK.voltarInterno = null;
  function marcar() { try { history.pushState({ ak: 1 }, ''); } catch (e) {} }
  function sair() {
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'ATIVAMENTE_BACK' }, '*');
    else if (history.length > 1) history.back();
  }
  AK.voltar = function () {
    if (AK.modalAberto) { AK.modalAberto.remove(); AK.modalAberto = null; return; }
    if (AK.voltarInterno && AK.voltarInterno()) return;
    sair();
  };
  window.ativamenteVoltar = AK.voltar;
  window.addEventListener('load', marcar);
  window.addEventListener('popstate', function () {
    if (AK.modalAberto) { AK.modalAberto.remove(); AK.modalAberto = null; marcar(); return; }
    if (AK.voltarInterno && AK.voltarInterno()) { marcar(); return; }
    sair();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') AK.voltar(); });

  window.AK = AK;
})();
