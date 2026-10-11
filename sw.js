// ==========================================
// ATIVAMENTE — SERVICE WORKER
// Offline + atualização automática
// ==========================================

const CACHE = 'ativamente-pastel-v7';

const ARQUIVOS = [
  "./",
  "./index.html",
  "./responsivo-dispositivos.css",
  "./manifest.json",
  "./logo.png",
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
  "./jogo-das-palavras/index.html",
  "./jogo-das-palavras/styles.css",
  "./jogo-das-palavras/app.js",
  "./jogo-das-palavras/manifest.json",
  "./jogo-das-palavras/logo-jogo-das-palavras.png",
  "./jogo-das-palavras/sw.js"
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

  // Apenas requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        // ======================================
        // ONLINE
        // ======================================

        if (
          response &&
          response.status === 200
        ) {

          const copy = response.clone();

          caches.open(CACHE).then(cache => {

            cache.put(
              event.request,
              copy
            );

          });

        }

        return response;

      })

      .catch(() => {

        // ======================================
        // OFFLINE
        // ======================================

        return caches.match(event.request);

      })

  );

});
