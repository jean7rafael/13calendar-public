/* Esta revisão invalida o cache antigo que podia manter um pacote anterior. */
const CACHE_NAME = '13calendar-runtime-v2';

/* A rede é a fonte principal da interface. O cache só assume quando o acesso
   falha, preservando o funcionamento offline sem congelar novas publicações. */
async function fetchAndCache(request, fetchOptions) {
  const response = await fetch(request, fetchOptions);

  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }

  return response;
}

async function networkFirst(request, fallbackUrl, fetchOptions) {
  try {
    return await fetchAndCache(request, fetchOptions);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) return caches.match(fallbackUrl);
    return Response.error();
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(new URL('./', self.registration.scope).toString()))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, new URL('./', self.registration.scope).toString()));
    return;
  }

  /* Scripts, estilos e workers são revalidados antes de usar a cópia offline.
     Assim um arquivo carregador antigo não mantém chunks de outra publicação. */
  if (['script', 'style', 'worker'].includes(request.destination)) {
    event.respondWith(networkFirst(request, null, { cache: 'no-cache' }));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetchAndCache(request)
        .catch(() => cached || Response.error());
      return cached || network;
    }),
  );
});
