// ==========================================
// ATIVAMENTE — SERVICE WORKER
// Offline + atualização automática
// ==========================================

const CACHE = 'ativamente-pastel-v32';

const ARQUIVOS = [
  "./",
  "./index.html",
  "./jogo-das-palavras.html",
  "./responsivo-dispositivos.css",
  "./manifest.json",
  "./logo.png",
  "./ajustes.js",
  "./ativamente-kit.js",
  "./ativamente-kit.css",
  "./lateralidade.html",
  "./siga-o-traco.html",
  "./labirinto.html",
  "./loja.js",
  "./desbloqueio.js",
  "./capa-labirinto.webp",
  "./sinal-verde.html",
  "./mexe-o-corpo.html",
  "./emocoes.html",
  "./capa-lateralidade.webp",
  "./capa-siga-o-traco.webp",
  "./lapis.webp",
  "./capa-sinal-verde.webp",
  "./capa-mexe-o-corpo.webp",
  "./capa-emocoes.webp",
  "./crianca-costas.webp",
  "./crianca-frente.webp",
  "./emocao-alegria-A.webp",
  "./emocao-alegria-B.webp",
  "./emocao-alegria-C.webp",
  "./emocao-medo-A.webp",
  "./emocao-medo-B.webp",
  "./emocao-medo-C.webp",
  "./emocao-nojo-A.webp",
  "./emocao-nojo-B.webp",
  "./emocao-nojo-C.webp",
  "./emocao-raiva-A.webp",
  "./emocao-raiva-B.webp",
  "./emocao-raiva-C.webp",
  "./emocao-surpresa-A.webp",
  "./emocao-surpresa-B.webp",
  "./emocao-surpresa-C.webp",
  "./emocao-tristeza-A.webp",
  "./emocao-tristeza-B.webp",
  "./emocao-tristeza-C.webp",
  "./luz-verde.webp",
  "./luz-vermelha.webp",
  "./mao-dorso.webp",
  "./mao-palma.webp",
  "./mov-agachar.webp",
  "./mov-aviao.webp",
  "./mov-bracos.webp",
  "./mov-correr.webp",
  "./mov-equilibrio.webp",
  "./mov-girar.webp",
  "./mov-inclinar.webp",
  "./mov-marchar.webp",
  "./mov-palmas.webp",
  "./mov-polichinelo.webp",
  "./mov-pular.webp",
  "./q-agachar-01.webp",
  "./q-agachar-02.webp",
  "./q-agachar-03.webp",
  "./q-agachar-04.webp",
  "./q-agachar-05.webp",
  "./q-agachar-06.webp",
  "./q-agachar-07.webp",
  "./q-agachar-08.webp",
  "./q-agachar-09.webp",
  "./q-agachar-10.webp",
  "./q-agachar-11.webp",
  "./q-agachar-12.webp",
  "./q-agachar-13.webp",
  "./q-agachar-14.webp",
  "./q-agachar-15.webp",
  "./q-agachar-16.webp",
  "./q-agachar-17.webp",
  "./q-agachar-18.webp",
  "./q-agachar-19.webp",
  "./q-agachar-20.webp",
  "./q-polichinelo-01.webp",
  "./q-polichinelo-02.webp",
  "./q-polichinelo-03.webp",
  "./q-polichinelo-04.webp",
  "./q-pular-01.webp",
  "./q-pular-02.webp",
  "./q-pular-03.webp",
  "./q-pular-04.webp",
  "./q-pular-05.webp",
  "./q-pular-06.webp",
  "./q-pular-07.webp",
  "./q-pular-08.webp",
  "./q-pular-09.webp",
  "./q-pular-10.webp",
  "./q-pular-11.webp",
  "./q-pular-12.webp",
  "./q-pular-13.webp",
  "./q-pular-14.webp",
  "./q-pular-15.webp",
  "./q-pular-16.webp",
  "./q-pular-17.webp",
  "./q-pular-18.webp",
  "./q-pular-19.webp",
  "./q-pular-20.webp",
  "./mov-socos.webp",
  "./mov-tocar.webp",

  "./logo-en.png",
  "./logo-es.png",
  "./logo-en.png",
  "./logo-es.png",
  "./palavras-termo.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./destrava.html",
  "./trava-letras.html",
  "./termo-solo.html",
  "./termo-duel.html",
  "./cores-setas.html",
  "./setas-4direcoes.html",
  "./genius-square.html",
  "./memoria-ativa.html",
  "./damas.html",
  "./quebra-cabeca.html",
  "./conhecendo-o-corpo.html",
  "./Xadrez-Ativamente-Premium-3.6.html",
  "./i18n-conhecendo-o-corpo.js",
  "./i18n-cores-setas.js",
  "./i18n-damas.js",
  "./i18n-destrava.js",
  "./i18n-genius-square.js",
  "./i18n-memoria-ativa.js",
  "./i18n-menu.js",
  "./i18n-quebra-cabeca.js",
  "./i18n-setas-4direcoes.js",
  "./i18n-trava-letras.js",
  "./i18n-xadrez.js",
  "./i18n.js"
];


// ==========================================
// INSTALAÇÃO
// ==========================================

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE).then(cache => {

      return cache.addAll(ARQUIVOS);

    })

  );

  // Ativa imediatamente
  self.skipWaiting();

});


// ==========================================
// ATIVAÇÃO
// ==========================================

self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))

      );

    }).then(() => {

      // Assume o controle das páginas abertas
      return self.clients.claim();

    })

  );

});


// ==========================================
// BUSCA
// ==========================================

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  // Jogos abertos pelo menu levam os ajustes no endereço (?atv-...):
  // no próprio site, guarda e procura sempre a versão sem esses parâmetros
  const url = new URL(event.request.url);
  const local = url.origin === self.location.origin;
  if (local) url.search = '';
  const chave = local ? url.href : event.request;

  event.respondWith(
    caches.match(chave, { ignoreSearch: local }).then(cached => {

      // Atualiza em segundo plano (stale-while-revalidate)
      const rede = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(chave, copy));
        }
        return response;
      }).catch(() => cached || caches.match('./index.html'));

      return cached || rede;
    })
  );

});
