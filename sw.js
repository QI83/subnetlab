// SubnetLab — Service Worker
// Estratégia: cache-first para assets estáticos, rede como fallback
'use strict';

const CACHE_NAME = 'subnetlab-v4';

const ASSETS = [
  '.',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'data/modulo2.js',
  'data/modulo3.js',
  'img/m3-q040.webp',
  'img/m3-q049.webp',
  'img/m3-q075.webp',
  'img/m3-q076.webp',
  'img/m3-q082.webp',
  'img/m3-q093.webp',
  'img/m3-q150.webp',
  'img/m3-p14.webp',
  'img/m3-p17.webp',
  'img/m3-p18.webp',
  'img/m3-p21.webp',
  'img/m3-p24.webp',
  'img/m3-p26.webp',
  'img/m2-q01.webp',
  'img/m2-q04.webp',
  'img/m2-q05.webp',
  'img/m2-q06.webp',
  'img/m2-q07.webp',
  'img/m2-q09.webp',
  'img/m2-q14.webp',
  'img/m2-q20.webp',
  'img/m2-q21.webp',
  'img/m2-q22.webp',
  'img/m2-q25.webp',
  'img/m2-q28.webp',
  'img/m2-q30.webp',
  'img/m2-q38.webp',
  'img/m2-q40.webp',
  'img/m2-q44.webp',
  'img/m2-q45.webp',
  'img/m2-q46.webp',
];

// Instala e pré-carrega todos os assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Limpa caches antigos ao ativar
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: retorna do cache; se não encontrar, busca na rede
self.addEventListener('fetch', event => {
  // Ignora requisições não-GET e chrome-extension://
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http') && !event.request.url.startsWith('file')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Só cacheia respostas válidas
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Offline e não está em cache: retorna 503
        return new Response('Sem conexão. Abra o app online uma vez para habilitar o modo offline.', {
          status: 503,
          headers: {'Content-Type': 'text/plain; charset=utf-8'},
        });
      });
    })
  );
});
