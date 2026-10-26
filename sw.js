// ==========================================
// ATIVAMENTE — SERVICE WORKER
// Offline + atualização automática
// ==========================================

const CACHE = 'ativamente-pastel-v16';

const ARQUIVOS = [
  "./",
  "./index.html",
  "./jogo-das-palavras.html",
  "./responsivo-dispositivos.css",
  "./manifest.json",
  "./logo.png",
  "./ajustes.js",
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
