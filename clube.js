/* Ativamente — Clube do Caio (assinatura mensal na Google Play)
   • Libera todas as edições do jogo "Exploradores da Mente – As aventuras de Caio".
   • A 1ª edição continua grátis para todos (o controle por edição fica no próprio jogo).
   • Assinatura: produto "clube_caio", plano básico "mensal" (Play Console).
   • A compra fica atrás da mesma barreira para adultos da compra única.
   • Versão Amazon (sem Google Play Faturamento): edições liberadas, sem botão de assinar.
   Independente do desbloqueio_completo: a compra única continua liberando os outros jogos. */
(function () {
  'use strict';
  var PRODUTO = 'clube_caio';
  var PLANO = 'mensal';
  var K_ATIVO = 'ativamente-clube-caio';

  var AMAZON = window.ATIVAMENTE_LOJA === 'amazon';
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ativo() { return AMAZON || ler(K_ATIVO) === '1'; }

  var cap = window.Capacitor;
  var nativo = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var loja = null;
  if (nativo && !AMAZON) {
    try { loja = (cap.Plugins && cap.Plugins.NativePurchases) || (cap.registerPlugin && cap.registerPlugin('NativePurchases')) || null; }
    catch (e) { loja = null; }
  }

  var avisos = [];
  function avisar() { avisos.slice().forEach(function (fn) { try { fn(ativo()); } catch (e) {} }); }

  function assinou(lista) {
    return (lista || []).some(function (p) {
      if (!p || p.productIdentifier !== PRODUTO) return false;
      var comprado = p.purchaseState === 'PURCHASED' || p.purchaseState === '1' || p.purchaseState === 1;
      if (!comprado) return false;
      if (p.isActive === false) return false;                       // expirada ou cancelada e vencida
      if (p.expirationDate && new Date(p.expirationDate).getTime() < Date.now()) return false;
      return true;
    });
  }
  function sincronizar(erroSeFalhar) {
    if (!loja) return Promise.resolve(ativo());
    return loja.restorePurchases().catch(function () {})
      .then(function () { return loja.getPurchases({ productType: 'subs' }); })
      .then(function (r) {
        var ok = assinou(r && r.purchases);
        if (ok) gravar(K_ATIVO, '1');
        else if (r && Array.isArray(r.purchases)) gravar(K_ATIVO, '0'); // assinatura terminou
        avisar();
        return ok;
      })
      .catch(function () { if (erroSeFalhar) throw new Error('rede'); return ativo(); });
  }

  var preco = '';
  function buscarPreco() {
    if (!loja) return;
    loja.getProducts({ productIdentifiers: [PRODUTO], productType: 'subs' }).then(function (r) {
      var p = r && r.products && r.products[0];
      if (p && p.priceString) { preco = p.priceString; var b = document.getElementById('clubeAssinar'); if (b) b.textContent = 'Assinar por ' + preco + ' por mês'; }
    }).catch(function () {});
  }

  /* ---------- visual (usa o mesmo estilo das folhas do desbloqueio.js) ---------- */
  var aberto = null;
  function fechar() { if (aberto) { aberto.remove(); aberto = null; } }
  function folha(html) {
    fechar();
    var f = document.createElement('div'); f.className = 'desb-fundo';
    f.style.zIndex = '200'; // abre por cima do jogo aberto (o player fica na camada 100)
    f.innerHTML = '<div class="desb-card" role="dialog" aria-modal="true">' + html + '</div>';
    f.addEventListener('click', function (e) { if (e.target === f) fechar(); });
    document.body.appendChild(f); aberto = f; return f;
  }
  function msg(txt, ok) { var m = document.getElementById('clubeMsg'); if (m) { m.textContent = txt; m.className = 'desb-msg' + (ok ? ' ok' : ''); } }
  function ocupado(sim) { ['clubeAssinar', 'clubeRestaurar'].forEach(function (id) { var b = document.getElementById(id); if (b) b.disabled = sim; }); if (sim) msg('Aguarde…', true); }

  function barreira(depois) {
    var a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    var f = folha('<div class="emo">👨‍👩‍👧</div><h2>Pergunta para um adulto</h2><p>Quanto é ' + a + ' × ' + b + '?</p>' +
      '<input id="clubeResp" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="3">' +
      '<button class="desb-bt" id="clubeOk">Confirmar</button><button class="desb-bt sec" id="clubeFechar">Agora não</button><div class="desb-msg" id="clubeMsg"></div>');
    var inp = f.querySelector('#clubeResp'); setTimeout(function () { inp.focus(); }, 50);
    f.querySelector('#clubeFechar').onclick = fechar;
    function conferir() {
      if (parseInt(inp.value, 10) === a * b) depois();
      else { msg('Resposta errada. Peça ajuda a um adulto.'); setTimeout(fechar, 1600); }
    }
    f.querySelector('#clubeOk').onclick = conferir;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') conferir(); });
  }

  function tela() {
    if (ativo()) {
      var g = folha('<div class="emo">🚀</div><h2>Você é do Clube do Caio!</h2><p>Todas as edições estão liberadas. As novas edições chegam aqui automaticamente.</p>' +
        (loja ? '<button class="desb-bt sec" id="clubeGerenciar">Gerenciar assinatura</button>' : '') +
        '<button class="desb-bt" id="clubeFechar">Continuar</button><div class="desb-msg" id="clubeMsg"></div>');
      g.querySelector('#clubeFechar').onclick = fechar;
      var gm = g.querySelector('#clubeGerenciar');
      if (gm) gm.onclick = function () { barreira(function () { fechar(); if (loja.manageSubscriptions) loja.manageSubscriptions().catch(function () {}); }); };
      return;
    }
    var f = folha('<div class="emo">🚀</div><h2>Clube do Caio</h2>' +
      '<ul><li>Todas as edições do jogo do Caio</li><li>Novas edições ao longo do ano</li><li>22 jogos por edição, em 5 níveis</li><li>Sem anúncios</li></ul>' +
      (loja
        ? '<button class="desb-bt laranja" id="clubeAssinar">' + (preco ? 'Assinar por ' + preco + ' por mês' : 'Assinar o Clube do Caio') + '</button>' +
          '<button class="desb-bt sec" id="clubeRestaurar">Restaurar assinatura</button>' +
          '<p style="font-size:.8rem;margin:.8rem 0 0">Assinatura mensal com renovação automática pela Google Play. Cancele quando quiser em Google Play › Pagamentos e assinaturas.</p>'
        : '<p>A assinatura é feita no app Ativamente instalado pela Google Play.</p>') +
      '<button class="desb-bt sec" id="clubeFechar">Agora não</button><div class="desb-msg" id="clubeMsg"></div>');
    f.querySelector('#clubeFechar').onclick = fechar;
    var ba = f.querySelector('#clubeAssinar'); if (ba) ba.onclick = function () { barreira(assinar); };
    var br = f.querySelector('#clubeRestaurar'); if (br) br.onclick = restaurar;
    buscarPreco();
  }

  function assinar() {
    if (!loja) return;
    tela(); ocupado(true);
    loja.purchaseProduct({ productIdentifier: PRODUTO, planIdentifier: PLANO, productType: 'subs', quantity: 1 }).then(function (tr) {
      var est = tr && tr.purchaseState;
      if (est === 'PENDING' || est === 2 || est === '2') { ocupado(false); msg('Pagamento pendente. As edições serão liberadas quando o pagamento for confirmado.', true); return; }
      gravar(K_ATIVO, '1'); avisar(); ocupado(false); msg('Pronto! Bem-vindo ao Clube do Caio 🎉', true);
      setTimeout(fechar, 1800);
    }).catch(function (e) {
      ocupado(false);
      var txt = String((e && (e.message || e.code)) || '').toLowerCase();
      if (/cancel/.test(txt)) { msg(''); return; }
      if (/already|owned|possu/.test(txt)) { sincronizar(false).then(function (ok) { if (ok) { msg('Pronto! Bem-vindo ao Clube do Caio 🎉', true); setTimeout(fechar, 1800); } }); return; }
      msg('Não foi possível concluir. Verifique a internet e tente de novo.');
    });
  }
  function restaurar() {
    ocupado(true);
    sincronizar(true).then(function (ok) {
      ocupado(false);
      if (ok) { msg('Pronto! Sua assinatura foi encontrada 🎉', true); setTimeout(fechar, 1800); }
      else msg('Não encontramos uma assinatura ativa nesta conta Google.');
    }).catch(function () { ocupado(false); msg('Não foi possível concluir. Verifique a internet e tente de novo.'); });
  }

  /* API usada pelo jogo (exploradores.html, dentro do iframe do app) */
  window.AtivamenteClube = {
    ativo: ativo,
    amazon: AMAZON,
    podeAssinar: function () { return !!loja; },
    abrir: tela,
    aoMudar: function (fn) { avisos.push(fn); return function () { avisos = avisos.filter(function (x) { return x !== fn; }); }; }
  };

  if (loja) { sincronizar(false); buscarPreco(); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && loja) sincronizar(false); });
})();
