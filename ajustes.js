/* ==========================================================
   ATIVAMENTE — AJUSTES DA PLATAFORMA
   Idioma, tamanho do texto, sons e animações.
   Carregado ANTES do i18n.js no menu e em todos os jogos.
   Os ajustes chegam aos jogos também pelo endereço (?atv-...),
   porque alguns visualizadores e WebViews isolam o
   armazenamento de cada arquivo HTML.
   ========================================================== */
(function () {
  'use strict';
  var CHAVE = 'ativamente-ajustes';
  var CHAVE_IDIOMA = 'ativamente-idioma';
  var PADRAO = { texto: 'normal', som: 'on', anim: 'normal' };
  var VALIDOS = {
    lang: ['pt', 'en', 'es'],
    texto: ['normal', 'grande', 'maior'],
    som: ['on', 'off'],
    anim: ['normal', 'reduzida']
  };
  var ESCALA = { normal: 1, grande: 1.15, maior: 1.3 };

  function ler() {
    var a = {};
    try { a = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; } catch (e) {}
    var r = {};
    Object.keys(PADRAO).forEach(function (k) { r[k] = VALIDOS[k].indexOf(a[k]) >= 0 ? a[k] : PADRAO[k]; });
    return r;
  }
  function gravar(a) { try { localStorage.setItem(CHAVE, JSON.stringify(a)); } catch (e) {} }

  // 1) Ajustes recebidos pelo endereço (vindos do menu)
  var aj = ler();
  try {
    var url = new URL(location.href), mudou = false;
    var lang = url.searchParams.get('atv-lang');
    if (lang && VALIDOS.lang.indexOf(lang) >= 0) { try { localStorage.setItem(CHAVE_IDIOMA, lang); } catch (e) {} }
    Object.keys(PADRAO).forEach(function (k) {
      var v = url.searchParams.get('atv-' + k);
      if (v && VALIDOS[k].indexOf(v) >= 0) aj[k] = v;
    });
    ['lang'].concat(Object.keys(PADRAO)).forEach(function (k) {
      if (url.searchParams.has('atv-' + k)) { url.searchParams.delete('atv-' + k); mudou = true; }
    });
    if (mudou) {
      gravar(aj);
      // Limpa o endereço para uma troca de idioma interna do jogo (com reload) não ser desfeita
      try { history.replaceState(history.state, '', url.pathname + url.search + url.hash); } catch (e) {}
    }
  } catch (e) {}

  // 2) Sons desligados
  if (aj.som === 'off') {
    try {
      var P = HTMLMediaElement.prototype, playOriginal = P.play;
      P.play = function () { this.muted = true; return playOriginal.apply(this, arguments); };
    } catch (e) {}
    ['AudioContext', 'webkitAudioContext'].forEach(function (nome) {
      var C = window[nome]; if (!C) return;
      var Mudo = function () {
        var args = [null].concat([].slice.call(arguments));
        var ctx = new (Function.prototype.bind.apply(C, args))();
        try { ctx.suspend(); } catch (e) {}
        ctx.resume = function () { return Promise.resolve(); };
        return ctx;
      };
      Mudo.prototype = C.prototype;
      try { window[nome] = Mudo; } catch (e) {}
    });
    try { if (window.speechSynthesis) window.speechSynthesis.speak = function () {}; } catch (e) {}
  }

  // 3) Animações reduzidas
  function css(id, texto) {
    var s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; (document.head || document.documentElement).appendChild(s); }
    s.textContent = texto;
  }
  if (aj.anim === 'reduzida') {
    css('atv-anim', '*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}');
  }

  // 4) Tamanho do texto: aumenta só elementos com texto de verdade
  //    (letras soltas, números e peças de tabuleiro ficam iguais)
  var escala = ESCALA[aj.texto] || 1;
  var IGNORAR = /^(SCRIPT|STYLE|NOSCRIPT|SVG|CANVAS|IMG|VIDEO|IFRAME|TEXTAREA|SELECT|OPTION|HTML|HEAD|BODY)$/;
  function temTexto(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.replace(/\s+/g, '').length > 2) return true;
    }
    return false;
  }
  function antepassadoEscalado(el) {
    for (var p = el.parentElement; p; p = p.parentElement) if (p.hasAttribute('data-atv-fs')) return p;
    return null;
  }
  function escalar(raiz) {
    if (escala === 1 || !raiz || raiz.nodeType !== 1) return;
    var lista = [raiz].concat([].slice.call(raiz.querySelectorAll('*')));
    var alvo = [];
    lista.forEach(function (el) {
      if (IGNORAR.test(el.tagName.toUpperCase()) || el.hasAttribute('data-atv-fs') || el.closest('[data-atv-fixo]') || !temTexto(el)) return;
      var tam = parseFloat(getComputedStyle(el).fontSize); if (!tam) return;
      var pai = antepassadoEscalado(el);
      // Herdou o tamanho de quem já foi aumentado: não aumenta de novo
      if (pai && Math.abs(parseFloat(getComputedStyle(pai).fontSize) - tam) < 0.5) return;
      alvo.push([el, tam]);
    });
    alvo.forEach(function (x) {
      x[0].setAttribute('data-atv-fs', x[1]);
      x[0].style.setProperty('font-size', (x[1] * escala).toFixed(2) + 'px', 'important');
    });
  }
  if (escala !== 1) {
    var pendentes = [], agendado = false;
    var processar = function () {
      agendado = false;
      var l = pendentes; pendentes = [];
      l.forEach(function (el) { if (el.isConnected) escalar(el); });
    };
    var agendar = function (el) {
      pendentes.push(el);
      if (!agendado) { agendado = true; requestAnimationFrame(processar); }
    };
    var iniciar = function () {
      escalar(document.body);
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { if (m.target.parentElement) agendar(m.target.parentElement); return; }
          m.addedNodes.forEach(function (n) {
            if (n.nodeType === 1) agendar(n);
            else if (n.nodeType === 3 && n.parentElement) agendar(n.parentElement);
          });
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
  }

  // API usada pelo menu
  window.AtivamenteAjustes = {
    ler: ler,
    salvar: function (novos) {
      var a = ler();
      Object.keys(novos || {}).forEach(function (k) { if (VALIDOS[k] && VALIDOS[k].indexOf(novos[k]) >= 0) a[k] = novos[k]; });
      gravar(a); return a;
    },
    // Parâmetros que acompanham cada jogo aberto pelo menu
    query: function () {
      var a = ler(), l = 'pt';
      try { l = localStorage.getItem(CHAVE_IDIOMA) || (window.AtivamenteI18n && AtivamenteI18n.idioma) || 'pt'; } catch (e) {}
      return 'atv-lang=' + l + '&atv-texto=' + a.texto + '&atv-som=' + a.som + '&atv-anim=' + a.anim;
    },
    PADRAO: PADRAO
  };
})();
