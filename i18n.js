/* ==========================================================
   ATIVAMENTE — IDIOMAS (pt / en / es)
   O texto original de cada jogo continua em português no código.
   Este motor troca apenas o que aparece na tela, sem mexer
   em regras, mecânicas ou progresso.
   ========================================================== */
(function () {
  'use strict';
  var CHAVE = 'ativamente-idioma';
  var SUPORTADOS = ['pt', 'en', 'es'];

  function lerSalvo() {
    try { var v = localStorage.getItem(CHAVE); return SUPORTADOS.indexOf(v) >= 0 ? v : null; } catch (e) { return null; }
  }
  function doAparelho() {
    var n = String((navigator.languages && navigator.languages[0]) || navigator.language || 'pt').slice(0, 2).toLowerCase();
    return SUPORTADOS.indexOf(n) >= 0 ? n : 'pt';
  }

  var idioma = lerSalvo() || doAparelho();
  var exatos = { en: new Map(), es: new Map() };
  var parciais = { en: [], es: [] };     // frases que podem aparecer dentro de textos maiores
  var regras = [];                       // [RegExp, en, es]
  var buscaParcial = { en: null, es: null };
  var originais = new WeakMap();         // nó de texto -> texto em português
  var escritos = new WeakMap();          // nó de texto -> último texto escrito por nós
  var attrOriginais = new WeakMap();     // elemento -> {atributo: original}
  var ATRIBUTOS = ['placeholder', 'title', 'aria-label', 'alt'];
  var IGNORAR = /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT|CODE)$/;
  var tituloOriginal = null;

  function escapar(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function parcialPermitido(pt) {
    // Palavras soltas em minúsculas só trocam quando são o texto inteiro.
    return pt.length >= 4 && (/\s/.test(pt) || !/^[a-zà-ÿ]/.test(pt));
  }

  function registrar(lista) {
    lista.forEach(function (item) {
      var pt = item[0], en = item[1], es = item[2] == null ? item[1] : item[2];
      if (pt.indexOf('re:') === 0) { regras.push([new RegExp(pt.slice(3)), en, es]); return; }
      adicionar(pt, en, es);
      var up = pt.toUpperCase();
      if (up !== pt && !exatos.en.has(up)) adicionar(up, en.toUpperCase(), es.toUpperCase());
    });
    buscaParcial.en = buscaParcial.es = null;
  }
  function adicionar(pt, en, es) {
    exatos.en.set(pt, en); exatos.es.set(pt, es);
    if (parcialPermitido(pt)) { parciais.en.push(pt); parciais.es.push(pt); }
  }
  function regexParcial(l) {
    if (buscaParcial[l]) return buscaParcial[l];
    var chaves = parciais[l].slice().sort(function (a, b) { return b.length - a.length; });
    if (!chaves.length) return null;
    buscaParcial[l] = new RegExp('(^|[^\\p{L}\\p{N}])(' + chaves.map(escapar).join('|') + ')(?=$|[^\\p{L}\\p{N}])', 'gu');
    return buscaParcial[l];
  }

  function t(texto, l) {
    l = l || idioma;
    if (l === 'pt' || texto == null) return texto;
    var bruto = String(texto);
    var limpo = bruto.trim();
    if (!limpo || !/\p{L}/u.test(limpo)) return bruto;
    var mapa = exatos[l];
    if (mapa.has(limpo)) return bruto.replace(limpo, mapa.get(limpo));
    for (var i = 0; i < regras.length; i++) {
      var r = regras[i];
      if (r[0].test(limpo)) {
        var alvo = l === 'en' ? r[1] : r[2];
        var res = limpo.replace(r[0], function () {
          var g = arguments;
          return alvo.replace(/\$(\d)/g, function (_, n) { return t(g[+n] || '', l); });
        });
        return bruto.replace(limpo, res);
      }
    }
    var re = regexParcial(l);
    if (!re) return bruto;
    return bruto.replace(re, function (_, antes, frase) { return antes + mapa.get(frase); });
  }

  /* ---------- aplicação na tela ---------- */
  function deveIgnorar(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (IGNORAR.test(e.tagName) || e.isContentEditable || e.getAttribute('translate') === 'no' || e.classList.contains('notranslate')) return true;
    }
    return false;
  }
  function textoNo(no) {
    var pai = no.parentElement;
    if (!pai || deveIgnorar(pai)) return;
    var atual = no.nodeValue;
    if (escritos.get(no) !== atual) originais.set(no, atual);   // o jogo escreveu algo novo
    var base = originais.get(no);
    var novo = idioma === 'pt' ? base : t(base);
    if (novo !== atual) { escritos.set(no, novo); no.nodeValue = novo; }
    else escritos.set(no, atual);
  }
  function atributos(el) {
    if (deveIgnorar(el)) return;
    var memo = attrOriginais.get(el) || {};
    ATRIBUTOS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a);
      if (memo['_w' + a] !== v) memo[a] = v;
      var novo = idioma === 'pt' ? memo[a] : t(memo[a]);
      memo['_w' + a] = novo;
      if (novo !== v) el.setAttribute(a, novo);
    });
    if (el.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(el.type) && el.value) {
      if (memo._wvalue !== el.value) memo.value = el.value;
      var nv = idioma === 'pt' ? memo.value : t(memo.value);
      memo._wvalue = nv; if (nv !== el.value) el.value = nv;
    }
    attrOriginais.set(el, memo);
  }
  function percorrer(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) { textoNo(raiz); return; }
    if (raiz.nodeType !== 1 && raiz.nodeType !== 9 && raiz.nodeType !== 11) return;
    if (raiz.nodeType === 1) { if (deveIgnorar(raiz)) return; atributos(raiz); }
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) { return n.nodeType === 1 && IGNORAR.test(n.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n; while ((n = w.nextNode())) { if (n.nodeType === 3) textoNo(n); else atributos(n); }
  }
  function titulo() {
    if (tituloOriginal === null) tituloOriginal = document.title;
    var novo = idioma === 'pt' ? tituloOriginal : t(tituloOriginal);
    if (document.title !== novo) document.title = novo;
  }
  function aplicarTudo() {
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
    if (document.body) percorrer(document.body);
    titulo();
  }

  var observador = new MutationObserver(function (lista) {
    if (idioma === 'pt') return;
    for (var i = 0; i < lista.length; i++) {
      var m = lista[i];
      if (m.type === 'characterData') textoNo(m.target);
      else if (m.type === 'attributes') atributos(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) percorrer(m.addedNodes[j]);
    }
  });

  function iniciar() {
    if (idioma !== 'pt') aplicarTudo();
    observador.observe(document.documentElement, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ATRIBUTOS.concat(['value'])
    });
  }

  /* Mensagens nativas (alert/confirm/prompt) também são traduzidas */
  ['alert', 'confirm', 'prompt'].forEach(function (nome) {
    var original = window[nome];
    if (typeof original !== 'function') return;
    window[nome] = function (msg) {
      var args = Array.prototype.slice.call(arguments);
      if (args.length) args[0] = t(msg);
      return original.apply(window, args);
    };
  });

  function definir(l) {
    if (SUPORTADOS.indexOf(l) < 0) return;
    idioma = l;
    try { localStorage.setItem(CHAVE, l); } catch (e) {}
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;
    if (document.body) percorrer(document.body);
    titulo();
    try { window.dispatchEvent(new CustomEvent('ativamente-idioma', { detail: l })); } catch (e) {}
  }

  window.AtivamenteI18n = {
    get idioma() { return idioma; },
    salvo: lerSalvo,
    doAparelho: doAparelho,
    definir: definir,
    registrar: function (lista) { registrar(lista); if (idioma !== 'pt' && document.body) aplicarTudo(); },
    t: function (s) { return t(s); },
    aplicar: aplicarTudo
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

/* Textos comuns a todos os jogos */
AtivamenteI18n.registrar([
  ['Deseja sair deste jogo e voltar ao menu do Ativamente?', 'Leave this game and go back to the Ativamente menu?', '¿Quieres salir de este juego y volver al menú de Ativamente?'],
  ['Deseja sair desta tela?', 'Leave this screen?', '¿Quieres salir de esta pantalla?'],
  ['Voltar ao menu', 'Back to menu', 'Volver al menú'],
  ['Voltar', 'Back', 'Volver'],
  ['← Voltar', '← Back', '← Volver'],
  ['← VOLTAR', '← BACK', '← VOLVER'],
  ['Menu', 'Menu', 'Menú'],
  ['Menu principal', 'Main menu', 'Menú principal'],
  ['Como jogar', 'How to play', 'Cómo jugar'],
  ['❓ Como jogar', '❓ How to play', '❓ Cómo jugar'],
  ['Entendi', 'Got it', 'Entendido'],
  ['Fechar', 'Close', 'Cerrar'],
  ['Jogar', 'Play', 'Jugar'],
  ['Jogar novamente', 'Play again', 'Jugar de nuevo'],
  ['Jogar de novo', 'Play again', 'Jugar de nuevo'],
  ['Repetir', 'Replay', 'Repetir'],
  ['Próxima', 'Next', 'Siguiente'],
  ['Reiniciar', 'Restart', 'Reiniciar'],
  ['Dica', 'Hint', 'Pista'],
  ['💡 Dica', '💡 Hint', '💡 Pista'],
  ['Tempo', 'Time', 'Tiempo'],
  ['Tempo esgotado!', "Time's up!", '¡Se acabó el tiempo!'],
  ['Fácil', 'Easy', 'Fácil'],
  ['Médio', 'Medium', 'Medio'],
  ['Difícil', 'Hard', 'Difícil'],
  ['Expert', 'Expert', 'Experto'],
  ['Mestre', 'Master', 'Maestro'],
  ['Som', 'Sound', 'Sonido'],
  ['Configurações', 'Settings', 'Ajustes'],
  ['⚙️ Configurações', '⚙️ Settings', '⚙️ Ajustes'],
  ['Ajustes', 'Settings', 'Ajustes'],
  ['⚙️ Ajustes', '⚙️ Settings', '⚙️ Ajustes'],
  ['🏆 Novo recorde!', '🏆 New record!', '🏆 ¡Nuevo récord!'],
  ['Parabéns! 🎉', 'Congratulations! 🎉', '¡Felicidades! 🎉'],
  ['Muito bem!', 'Well done!', '¡Muy bien!'],
  ['Jogador 1', 'Player 1', 'Jugador 1'],
  ['Jogador 2', 'Player 2', 'Jugador 2'],
  ['re:^Jogador (\\d+)$', 'Player $1', 'Jugador $1'],
  ['re:^Fase (\\d+)$', 'Level $1', 'Nivel $1'],
  ['Fase', 'Level', 'Nivel'],
  ['Começar', 'Start', 'Empezar'],
  ['Continuar', 'Continue', 'Continuar'],
  ['Vermelho', 'Red', 'Rojo'],
  ['Azul', 'Blue', 'Azul'],
  ['Verde', 'Green', 'Verde'],
  ['Amarelo', 'Yellow', 'Amarillo'],
  ['Ativamente — Jogos Educativos', 'Ativamente — Educational Games', 'Ativamente — Juegos Educativos'],
  ['Ativamente - Jogos Educativos', 'Ativamente - Educational Games', 'Ativamente - Juegos Educativos']
]);
