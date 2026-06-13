/* Service Worker — Estudio Matemática (PWA offline)
   - HTML / CSS / JS: network-first (siempre lo último; sin conexión → copia en caché).
   - Íconos / manifest: cache-first (carga instantánea).
   Al cambiar el contenido, subí el número de versión (CACHE) para forzar el refresco. */
const CACHE = "mate-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/practice.js",
  "./js/logic.js",
  "./js/complex.js",
  "./js/sets.js",
  "./js/radicals.js",
  "./js/calc.js",
  "./js/games.js",
  "./js/app.js",
  "./site.webmanifest",
  "./favicon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFresh = req.mode === "navigate" || url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") || url.pathname.endsWith(".css");

  if (isFresh) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((m) => m || caches.match("./index.html")))
    );
  } else {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then((m) => m || fetch(req).then((res) => {
        const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res;
      }))
    );
  }
});
