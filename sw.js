/**
 * Service Worker - Ruta Turística Sostenible
 * Estrategia híbrida segura para funcionar con poca o nula señal en carretera:
 * 1. Archivos propios (HTML, JS, CSS): Network-First con timeout de 4s (si hay internet siempre muestra lo último; si no hay señal o está colgada, usa caché).
 * 2. Librerías CDN (Leaflet, jsPDF, Flatpickr, Swiper, FontAwesome): Cache-First para carga instantánea y disponibilidad offline.
 * 3. Cuadrículas del mapa (Esri ArcGIS) e imágenes: Cache con respaldo de red para moverse por el mapa sin señal.
 */

const APP_CACHE = 'ruta-app-v7.0';
const CDN_CACHE = 'ruta-cdn-v1.0';
const TILES_CACHE = 'ruta-tiles-v1.0';

const CORE_ASSETS = [
    './',
    './index.html',
    './assets/css/tailwind.min.css',
    './assets/js/data.js?v=7.0',
    './assets/js/itinerary.js?v=7.0',
    './assets/js/app.js?v=7.0'
];

const CDN_ASSETS = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
    'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
    'https://npmcdn.com/flatpickr/dist/themes/material_blue.css',
    'https://cdn.jsdelivr.net/npm/flatpickr',
    'https://npmcdn.com/flatpickr/dist/l10n/es.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        Promise.all([
            caches.open(APP_CACHE).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {})),
            caches.open(CDN_CACHE).then((cache) =>
                Promise.allSettled(
                    CDN_ASSETS.map((url) =>
                        fetch(url, { mode: 'cors' })
                            .then((res) => {
                                if (res.ok) return cache.put(url, res);
                            })
                            .catch(() => {})
                    )
                )
            )
        ])
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (![APP_CACHE, CDN_CACHE, TILES_CACHE].includes(key)) {
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

/**
 * Fetch con límite de tiempo para evitar que la página se quede en blanco
 * cuando el celular tiene 1 raya de señal sin transferencia real de datos.
 */
function fetchWithTimeout(request, timeoutMs = 4000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Network timeout')), timeoutMs);
        fetch(request)
            .then((response) => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Ignorar Google Translate si no hay buena señal para que nunca bloquee la app
    if (url.hostname.includes('translate.google') || url.hostname.includes('translate.googleapis')) {
        return;
    }

    // 1. Librerías CDN y Fuentes -> Cache-First (nunca cambian de versión y aceleran iPhone/Android con poca señal)
    const isCDN =
        url.hostname.includes('unpkg.com') ||
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('npmcdn.com') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('flagcdn.com');

    if (isCDN) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((res) => {
                    if (res && (res.status === 200 || res.type === 'opaque')) {
                        const clone = res.clone();
                        caches.open(CDN_CACHE).then((cache) => cache.put(req, clone));
                    }
                    return res;
                });
            })
        );
        return;
    }

    // 2. Cuadrículas del Mapa (Esri ArcGIS) -> Cache-First con actualización silenciosa
    if (url.hostname.includes('arcgisonline.com')) {
        event.respondWith(
            caches.open(TILES_CACHE).then((cache) =>
                cache.match(req).then((cached) => {
                    const networkFetch = fetch(req)
                        .then((res) => {
                            if (res && (res.status === 200 || res.type === 'opaque')) {
                                cache.put(req, res.clone());
                            }
                            return res;
                        })
                        .catch(() => cached);

                    return cached || networkFetch;
                })
            )
        );
        return;
    }

    // 3. Archivos propios del sitio (HTML, JS, CSS, imágenes locales) -> Network-First con respaldo offline rápido (4s)
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetchWithTimeout(req, 4000)
                .then((res) => {
                    if (res && res.status === 200) {
                        const clone = res.clone();
                        caches.open(APP_CACHE).then((cache) => cache.put(req, clone));
                    }
                    return res;
                })
                .catch(() =>
                    caches.match(req).then((cached) => {
                        if (cached) return cached;
                        // Si pide navegación HTML y no coincide query string, devolver index.html
                        if (req.mode === 'navigate') {
                            return caches.match('./index.html') || caches.match('./');
                        }
                        // Buscar ignorando query string (?v=...) como último respaldo
                        return caches.match(req, { ignoreSearch: true });
                    })
                )
        );
    }
});

