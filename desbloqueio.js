/* Ativamente — teste grátis, limite diário e desbloqueio pago (compra única)
   Regras:
   • 3 dias de teste com todos os jogos liberados (contados a partir do 1º uso).
   • Depois: 4 jogos sempre livres + 1 vez por dia em cada um dos outros.
   • Compra única na Google Play ("desbloqueio_completo") libera tudo para sempre.
   • A compra fica atrás de uma barreira para adultos (conta de multiplicar).
   Depende do menu (index.html): JOGOS, abrirJogo(), renderizar(). */
(function () {
  'use strict';
  var PRODUTO = 'desbloqueio_completo';
  var GRATIS = ['memoria-ativa', 'cores-setas', 'quebra-cabeca', 'lateralidade'];
  var DIAS_TESTE = 3;
  var LOJA = 'https://play.google.com/store/apps/details?id=com.damas.ativamente';
  var K_PAGO = 'ativamente-desbloqueio', K_INICIO = 'ativamente-inicio', K_VEZES = 'ativamente-vezes';

  var I = window.AtivamenteI18n;
  var t = function (s) { return I ? I.t(s) : s; };
  if (I) I.registrar([
    ['Desbloquear tudo', 'Unlock everything', 'Desbloquear todo'],
    ['Desbloquear todos os jogos', 'Unlock all games', 'Desbloquear todos los juegos'],
    ['🎁 Teste grátis: todos os jogos liberados', '🎁 Free trial: all games unlocked', '🎁 Prueba gratis: todos los juegos desbloqueados'],
    ['Último dia de teste grátis', 'Last day of the free trial', 'Último día de prueba gratis'],
    ['Faltam {N} dias de teste grátis', '{N} days of free trial left', 'Quedan {N} días de prueba gratis'],
    ['4 jogos livres e 1 partida por dia nos outros', '4 free games and 1 play per day on the others', '4 juegos libres y 1 partida por día en los demás'],
    ['1× hoje', '1× today', '1× hoy'],
    ['Amanhã', 'Tomorrow', 'Mañana'],
    ['Livre', 'Free', 'Libre'],
    ['Hoje você pode jogar 1 vez grátis', 'Today you can play once for free', 'Hoy puedes jugar 1 vez gratis'],
    ['Enquanto o jogo estiver aberto, pode jogar à vontade. Amanhã tem outra vez.', 'While the game is open, play as much as you like. Tomorrow you get another turn.', 'Mientras el juego esté abierto, puedes jugar todo lo que quieras. Mañana tienes otra vez.'],
    ['Jogar agora', 'Play now', 'Jugar ahora'],
    ['Você já jogou este jogo hoje', 'You already played this game today', 'Ya jugaste este juego hoy'],
    ['Volte amanhã para jogar de novo, ou peça a um adulto para desbloquear todos os jogos.', 'Come back tomorrow to play again, or ask an adult to unlock all games.', 'Vuelve mañana para jugar otra vez, o pide a un adulto que desbloquee todos los juegos.'],
    ['Agora não', 'Not now', 'Ahora no'],
    ['Todos os jogos, sem limite por dia', 'All games, no daily limit', 'Todos los juegos, sin límite diario'],
    ['Compra única, sem assinatura', 'One-time purchase, no subscription', 'Compra única, sin suscripción'],
    ['Sem anúncios', 'No ads', 'Sin anuncios'],
    ['Novos jogos incluídos', 'New games included', 'Juegos nuevos incluidos'],
    ['Desbloquear por {P}', 'Unlock for {P}', 'Desbloquear por {P}'],
    ['Restaurar compra', 'Restore purchase', 'Restaurar compra'],
    ['Pergunta para um adulto', 'Question for an adult', 'Pregunta para un adulto'],
    ['Quanto é {A} × {B}?', 'What is {A} × {B}?', '¿Cuánto es {A} × {B}?'],
    ['Confirmar', 'Confirm', 'Confirmar'],
    ['Resposta errada. Peça ajuda a um adulto.', 'Wrong answer. Ask an adult for help.', 'Respuesta incorrecta. Pide ayuda a un adulto.'],
    ['Aguarde…', 'Please wait…', 'Espera…'],
    ['Pronto! Todos os jogos foram desbloqueados 🎉', 'Done! All games are unlocked 🎉', '¡Listo! Todos los juegos están desbloqueados 🎉'],
    ['Pagamento pendente. Os jogos serão liberados quando o pagamento for confirmado.', 'Payment pending. Games will unlock once the payment is confirmed.', 'Pago pendiente. Los juegos se desbloquearán cuando se confirme el pago.'],
    ['Não encontramos uma compra nesta conta Google.', 'No purchase was found on this Google account.', 'No encontramos una compra en esta cuenta de Google.'],
    ['Não foi possível concluir. Verifique a internet e tente de novo.', 'Could not complete. Check your internet and try again.', 'No se pudo completar. Revisa tu internet e inténtalo de nuevo.'],
    ['A compra é feita no app Ativamente da Google Play.', 'The purchase is made in the Ativamente app on Google Play.', 'La compra se hace en la app Ativamente de Google Play.'],
    ['Abrir na Google Play', 'Open on Google Play', 'Abrir en Google Play'],
    ['Todos os jogos desbloqueados ✓', 'All games unlocked ✓', 'Todos los juegos desbloqueados ✓']
  ]);

  /* ---------- estado ---------- */
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function hoje() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function diaNum(d) { return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }
  if (!ler(K_INICIO)) gravar(K_INICIO, String(diaNum(new Date())));

  function pago() { return ler(K_PAGO) === '1'; }
  function diasRestantes() {
    var ini = parseInt(ler(K_INICIO), 10), agora = diaNum(new Date());
    if (isNaN(ini) || agora < ini) return 0; // relógio voltou para trás: sem teste
    return Math.max(0, DIAS_TESTE - (agora - ini));
  }
  function vezes() { try { return JSON.parse(ler(K_VEZES) || '{}'); } catch (e) { return {}; } }
  function usouHoje(id) { return vezes()[id] === hoje(); }
  function marcarUso(id) { var v = vezes(); v[id] = hoje(); gravar(K_VEZES, JSON.stringify(v)); }
  // 'livre' | 'teste' | 'pago' | 'disponivel' (1× hoje) | 'usado'
  function situacao(id) {
    if (pago()) return 'pago';
    if (GRATIS.indexOf(id) >= 0) return 'livre';
    if (diasRestantes() > 0) return 'teste';
    return usouHoje(id) ? 'usado' : 'disponivel';
  }

  /* ---------- Google Play (só no app Android) ---------- */
  var cap = window.Capacitor;
  var nativo = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var loja = null;
  if (nativo) {
    try { loja = (cap.Plugins && cap.Plugins.NativePurchases) || (cap.registerPlugin && cap.registerPlugin('NativePurchases')) || null; }
    catch (e) { loja = null; }
  }
  var preco = '';
  function comprou(lista) {
    return (lista || []).some(function (p) {
      return p.productIdentifier === PRODUTO && (p.purchaseState === 'PURCHASED' || p.purchaseState === '1' || p.purchaseState === 1);
    });
  }
  function sincronizar(avisar) {
    if (!loja) return Promise.resolve(false);
    // restorePurchases também reconhece compras que estavam pendentes (evita reembolso automático)
    return loja.restorePurchases().catch(function () {})
      .then(function () { return loja.getPurchases({ productType: 'inapp' }); })
      .then(function (r) {
        var ok = comprou(r && r.purchases);
        if (ok) gravar(K_PAGO, '1');
        else if (pago() && r && Array.isArray(r.purchases)) gravar(K_PAGO, '0'); // compra reembolsada
        atualizar();
        return ok;
      })
      .catch(function () { if (avisar) throw new Error('rede'); return false; });
  }
  function buscarPreco() {
    if (!loja) return;
    loja.getProducts({ productIdentifiers: [PRODUTO], productType: 'inapp' }).then(function (r) {
      var p = r && r.products && r.products[0];
      if (p && p.priceString) { preco = p.priceString; var b = document.getElementById('desbComprar'); if (b) b.textContent = t('Desbloquear por {P}').replace('{P}', preco); }
    }).catch(function () {});
  }

  /* ---------- visual ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.desb-banner{display:flex;align-items:center;gap:.8rem;margin:0 0 1rem;padding:.85rem 1rem;border-radius:20px;background:linear-gradient(135deg,#fff7e0,#ffe9f3);border:2px solid #ffd98a;box-shadow:0 6px 18px rgba(45,42,74,.07)}' +
    '.desb-banner .txt{flex:1;font-weight:800;color:#5a3f12;font-size:.95rem;line-height:1.3}.desb-banner small{display:block;font-weight:700;color:#8a6a2c;font-size:.8rem;margin-top:.15rem}' +
    '.desb-banner button{border:0;border-radius:14px;padding:.7rem .9rem;font:inherit;font-weight:900;color:#fff;background:linear-gradient(135deg,#ff9f43,#ff6fa8);min-height:46px;cursor:pointer;white-space:nowrap}' +
    '.desb-banner.ok{background:#eafaf2;border-color:#9fe0c2}.desb-banner.ok .txt{color:#1d6b4b}' +
    '.card .desb-selo{position:absolute;top:.55rem;left:.55rem;z-index:2;padding:.25rem .55rem;border-radius:99px;font-size:.72rem;font-weight:900;background:#fff;color:#7c6fe0;box-shadow:0 2px 8px rgba(45,42,74,.15)}' +
    '.card .desb-selo.usado{background:#5b4a8a;color:#fff}.card .desb-selo.livre{color:#1d8a5b}' +
    '.card.desb-usado .logo-wrap{filter:grayscale(.85) opacity(.55)}' +
    '.desb-fundo{position:fixed;inset:0;z-index:80;background:rgba(45,42,74,.55);display:flex;align-items:flex-end;justify-content:center;padding:1rem;padding-bottom:calc(1rem + var(--sa-b,0px))}' +
    '.desb-card{width:min(440px,100%);background:#fff;border-radius:28px;padding:1.4rem 1.2rem 1.2rem;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.25);max-height:90vh;overflow:auto}' +
    '.desb-card .emo{font-size:2.6rem}.desb-card h2{font-size:1.35rem;font-weight:900;color:#2d2a4a;margin:.3rem 0 .5rem}' +
    '.desb-card p{color:#77758f;font-weight:700;line-height:1.45;margin:0 0 1rem}.desb-card ul{list-style:none;padding:0;margin:0 0 1.1rem;text-align:left;display:grid;gap:.45rem}' +
    '.desb-card li{font-weight:800;color:#2d2a4a}.desb-card li::before{content:"✓";color:#2fb37a;font-weight:900;margin-right:.5rem}' +
    '.desb-bt{display:block;width:100%;min-height:54px;border:0;border-radius:18px;font:inherit;font-weight:900;font-size:1.05rem;margin-top:.6rem;cursor:pointer;background:linear-gradient(135deg,#7c6fe0,#a26bf0);color:#fff}' +
    '.desb-bt.sec{background:#f1eefc;color:#4a3f8a}.desb-bt.laranja{background:linear-gradient(135deg,#ff9f43,#ff6fa8)}.desb-bt:disabled{opacity:.55}' +
    '.desb-card input{width:100%;min-height:56px;border-radius:16px;border:2px solid #d9d3f2;font:inherit;font-size:1.5rem;font-weight:900;text-align:center;margin:.2rem 0 .4rem}' +
    '.desb-msg{min-height:1.3em;font-weight:800;color:#c0392b;margin:.4rem 0 0}.desb-msg.ok{color:#1d8a5b}';
  document.head.appendChild(css);

  var aberto = null;
  function fechar() { if (aberto) { aberto.remove(); aberto = null; } }
  function folha(html) {
    fechar();
    var f = document.createElement('div'); f.className = 'desb-fundo';
    f.innerHTML = '<div class="desb-card" role="dialog" aria-modal="true">' + html + '</div>';
    f.addEventListener('click', function (e) { if (e.target === f) fechar(); });
    document.body.appendChild(f); aberto = f; return f;
  }

  function telaCompra() {
    var f = folha(
      '<div class="emo">🔓</div><h2>' + t('Desbloquear todos os jogos') + '</h2>' +
      '<ul><li>' + t('Todos os jogos, sem limite por dia') + '</li><li>' + t('Compra única, sem assinatura') + '</li>' +
      '<li>' + t('Sem anúncios') + '</li><li>' + t('Novos jogos incluídos') + '</li></ul>' +
      (loja
        ? '<button class="desb-bt laranja" id="desbComprar">' + (preco ? t('Desbloquear por {P}').replace('{P}', preco) : t('Desbloquear tudo')) + '</button>' +
          '<button class="desb-bt sec" id="desbRestaurar">' + t('Restaurar compra') + '</button>'
        : '<p>' + t('A compra é feita no app Ativamente da Google Play.') + '</p>' +
          '<button class="desb-bt laranja" id="desbLoja">' + t('Abrir na Google Play') + '</button>') +
      '<button class="desb-bt sec" id="desbFechar">' + t('Agora não') + '</button><div class="desb-msg" id="desbMsg"></div>');
    f.querySelector('#desbFechar').onclick = fechar;
    var bl = f.querySelector('#desbLoja'); if (bl) bl.onclick = function () { barreira(function () { window.open(LOJA, '_blank'); }); };
    var bc = f.querySelector('#desbComprar'); if (bc) bc.onclick = function () { barreira(comprar); };
    var br = f.querySelector('#desbRestaurar'); if (br) br.onclick = restaurar;
    buscarPreco();
  }
  function mensagem(txt, ok) { var m = document.getElementById('desbMsg'); if (m) { m.textContent = t(txt); m.className = 'desb-msg' + (ok ? ' ok' : ''); } }
  function ocupado(sim) { ['desbComprar', 'desbRestaurar'].forEach(function (id) { var b = document.getElementById(id); if (b) b.disabled = sim; }); if (sim) mensagem('Aguarde…', true); }

  /* barreira para adultos: conta de multiplicar */
  function barreira(depois) {
    var a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    var f = folha('<div class="emo">👨‍👩‍👧</div><h2>' + t('Pergunta para um adulto') + '</h2>' +
      '<p>' + t('Quanto é {A} × {B}?').replace('{A}', a).replace('{B}', b) + '</p>' +
      '<input id="desbResp" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="3">' +
      '<button class="desb-bt" id="desbOk">' + t('Confirmar') + '</button><button class="desb-bt sec" id="desbFechar">' + t('Agora não') + '</button><div class="desb-msg" id="desbMsg"></div>');
    var inp = f.querySelector('#desbResp'); setTimeout(function () { inp.focus(); }, 50);
    f.querySelector('#desbFechar').onclick = fechar;
    function conferir() {
      if (parseInt(inp.value, 10) === a * b) { telaCompra(); depois(); }
      else { mensagem('Resposta errada. Peça ajuda a um adulto.'); setTimeout(fechar, 1600); }
    }
    f.querySelector('#desbOk').onclick = conferir;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') conferir(); });
  }

  function comprar() {
    if (!loja) return;
    ocupado(true);
    loja.purchaseProduct({ productIdentifier: PRODUTO, productType: 'inapp', quantity: 1 }).then(function (tr) {
      var est = tr && tr.purchaseState;
      if (est === 'PENDING' || est === 2 || est === '2') { ocupado(false); mensagem('Pagamento pendente. Os jogos serão liberados quando o pagamento for confirmado.', true); return; }
      gravar(K_PAGO, '1'); atualizar(); ocupado(false); mensagem('Pronto! Todos os jogos foram desbloqueados 🎉', true);
      setTimeout(fechar, 1800);
    }).catch(function (e) {
      ocupado(false);
      var txt = String((e && (e.message || e.code)) || '').toLowerCase();
      if (/cancel/.test(txt)) { mensagem(''); return; }
      if (/already|owned|possu/.test(txt)) { sincronizar(false).then(function (ok) { if (ok) { mensagem('Pronto! Todos os jogos foram desbloqueados 🎉', true); setTimeout(fechar, 1800); } }); return; }
      mensagem('Não foi possível concluir. Verifique a internet e tente de novo.');
    });
  }
  function restaurar() {
    ocupado(true);
    sincronizar(true).then(function (ok) {
      ocupado(false);
      if (ok) { mensagem('Pronto! Todos os jogos foram desbloqueados 🎉', true); setTimeout(fechar, 1800); }
      else mensagem('Não encontramos uma compra nesta conta Google.');
    }).catch(function () { ocupado(false); mensagem('Não foi possível concluir. Verifique a internet e tente de novo.'); });
  }

  /* ---------- integração com o menu ---------- */
  function banner() {
    var lista = document.getElementById('lista'); if (!lista) return;
    var el = document.getElementById('desbBanner');
    if (!el) { el = document.createElement('div'); el.id = 'desbBanner'; lista.parentNode.insertBefore(el, lista); }
    if (pago()) { el.className = 'desb-banner ok'; el.innerHTML = '<div class="txt">' + t('Todos os jogos desbloqueados ✓') + '</div>'; return; }
    var d = diasRestantes(), txt, sub;
    if (d > 0) { txt = t('🎁 Teste grátis: todos os jogos liberados'); sub = d === 1 ? t('Último dia de teste grátis') : t('Faltam {N} dias de teste grátis').replace('{N}', d); }
    else { txt = t('Desbloquear todos os jogos'); sub = t('4 jogos livres e 1 partida por dia nos outros'); }
    el.className = 'desb-banner';
    el.innerHTML = '<div class="txt">' + txt + '<small>' + sub + '</small></div><button type="button">' + t('Desbloquear tudo') + '</button>';
    el.querySelector('button').onclick = telaCompra;
  }
  function selos() {
    document.querySelectorAll('#lista .card').forEach(function (card) {
      var s = situacao(card.dataset.id), velho = card.querySelector('.desb-selo');
      if (velho) velho.remove(); card.classList.remove('desb-usado');
      var txt = s === 'disponivel' ? t('1× hoje') : s === 'usado' ? '🔒 ' + t('Amanhã') : (s === 'livre' && !pago() && diasRestantes() === 0) ? t('Livre') : '';
      if (!txt) return;
      var b = document.createElement('span'); b.className = 'desb-selo ' + s; b.textContent = txt; card.appendChild(b);
      if (s === 'usado') card.classList.add('desb-usado');
    });
  }
  function atualizar() { banner(); selos(); }

  var abrirOriginal = window.abrirJogo, renderOriginal = window.renderizar;
  if (typeof abrirOriginal !== 'function' || typeof renderOriginal !== 'function') return;
  window.renderizar = function () { var r = renderOriginal.apply(this, arguments); atualizar(); return r; };
  window.abrirJogo = function (jogo) {
    if (!jogo) return;
    var s = situacao(jogo.id);
    if (s === 'pago' || s === 'livre' || s === 'teste') return abrirOriginal(jogo);
    if (s === 'disponivel') {
      var f = folha('<div class="emo">⭐</div><h2>' + t('Hoje você pode jogar 1 vez grátis') + '</h2>' +
        '<p>' + t('Enquanto o jogo estiver aberto, pode jogar à vontade. Amanhã tem outra vez.') + '</p>' +
        '<button class="desb-bt" id="desbJogar">' + t('Jogar agora') + '</button>' +
        '<button class="desb-bt sec" id="desbTudo">' + t('Desbloquear todos os jogos') + '</button>');
      f.querySelector('#desbJogar').onclick = function () { marcarUso(jogo.id); fechar(); abrirOriginal(jogo); };
      f.querySelector('#desbTudo').onclick = telaCompra;
      return;
    }
    var g = folha('<div class="emo">🌙</div><h2>' + t('Você já jogou este jogo hoje') + '</h2>' +
      '<p>' + t('Volte amanhã para jogar de novo, ou peça a um adulto para desbloquear todos os jogos.') + '</p>' +
      '<button class="desb-bt laranja" id="desbTudo">' + t('Desbloquear todos os jogos') + '</button><button class="desb-bt sec" id="desbFechar">' + t('Agora não') + '</button>');
    g.querySelector('#desbTudo').onclick = telaCompra;
    g.querySelector('#desbFechar').onclick = fechar;
  };

  window.addEventListener('ativamente-idioma', atualizar);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) atualizar(); }); // virou o dia
  window.AtivamenteDesbloqueio = { situacao: situacao, diasRestantes: diasRestantes, pago: pago, abrirCompra: telaCompra };
  atualizar();
  if (loja) { sincronizar(false); buscarPreco(); }
})();
