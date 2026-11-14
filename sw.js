// SubnetLab — Service Worker
// Estratégia:
//  - Código e HTML (js/css/html/navegação): NETWORK-FIRST — quem está online sempre
//    recebe a versão nova. Cair para o cache só quando estiver offline.
//  - Imagens e dados: CACHE-FIRST — não mudam e economizam rede.
// O cache-first puro prendia o aluno na versão antiga depois de cada deploy.
'use strict';

const CACHE_NAME = 'subnetlab-v27';

const ASSETS = [
  '.',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'data/modulo2.js',
  'data/modulo3.js',
  'data/modulo4.js',
  'img/logo-subnetlab.webp',
  'img/icon.webp',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/favicon.ico',
  'img/srwe-q001.webp',
  'img/srwe-q004.webp',
  'img/srwe-q005.webp',
  'img/srwe-q006.webp',
  'img/srwe-q007.webp',
  'img/srwe-q009.webp',
  'img/srwe-q014.webp',
  'img/srwe-q020.webp',
  'img/srwe-q021.webp',
  'img/srwe-q022.webp',
  'img/srwe-q025.webp',
  'img/srwe-q028.webp',
  'img/srwe-q030.webp',
  'img/srwe-q038.webp',
  'img/srwe-q040.webp',
  'img/srwe-q044.webp',
  'img/srwe-q045.webp',
  'img/srwe-q046.webp',
  'img/cert-q013.webp',
  'img/cert-q016.webp',
  'img/cert-q017.webp',
  'img/cert-q021.webp',
  'img/cert-q023.webp',
  'img/cert-q030.webp',
  'img/cert-q035.webp',
  'img/cert-q045.webp',
  'img/cert-q046.webp',
  'img/cert-q050.webp',
  'img/cert-q053.webp',
  'img/cert-q055.webp',
  'img/m3-q048.webp',
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

// Kill switch para versões antigas: se um SW antigo ainda controlar a página,
// o navegador busca o sw.js e este skipWaiting assume na hora.
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

// O que NUNCA deve ser servido do cache sem antes tentar a rede
const NETWORK_FIRST = /\/(index\.html)?$|\.(html|js|css|json)$/i;

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http') && !event.request.url.startsWith('file')) return;

  const url = new URL(event.request.url);
  const deveBuscarRedePrimeiro =
    event.request.mode === 'navigate' || NETWORK_FIRST.test(url.pathname);

  if (deveBuscarRedePrimeiro) {
    // NETWORK-FIRST: rede manda; cache é só o plano B offline.
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copia = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copia)).catch(() => {});
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(cached => cached || new Response(
          'Sem conexão. Abra o app online uma vez para habilitar o modo offline.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        ))
      )
    );
    return;
  }

  // CACHE-FIRST: imagens e demais assets estáticos.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache)).catch(() => {});
        return response;
      }).catch(() => new Response(
        'Sem conexão. Abra o app online uma vez para habilitar o modo offline.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      ));
    })
  );
});
