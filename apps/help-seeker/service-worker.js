// Network-first strategy: always tries to get fresh content,
// falls back to cache when offline. Bump CACHE_NAME to force full refresh.

const CACHE_NAME = 'helpseeker-v3'

const APP_SHELL = [
    './',
    './index.html',
    './main.js',
    './App.js',
    './router.js',
    './store.js',
    './vue.js',
    './vue-router.js',
    './vue.esm.js',
    './vue-router.esm.js',
    './characters.js',
    './styles/main.css',
    './views/HomeView.js',
    './views/ProfileCreateView.js',
    './views/ScenarioListView.js',
    './views/ScenarioPlayView.js',
    './views/CelebrationView.js',
    './services/db.js',
    './services/speech.js',
    './services/matcher.js',
    './data/scenarios.json',
    './manifest.json',
    './icons/icon.svg',
    './images/scenarios/de-phys-001.svg',
    './images/scenarios/de-phys-002.svg',
    './images/scenarios/de-phys-003.svg',
    './images/scenarios/de-phys-004.svg',
    './images/scenarios/de-phys-005.svg',
    './images/scenarios/de-phys-006.svg',
    './images/scenarios/de-phys-007.svg',
    './images/scenarios/de-phys-008.svg',
    './images/scenarios/de-phys-009.svg',
    './images/scenarios/de-phys-010.svg',
    './images/scenarios/de-acad-001.svg',
    './images/scenarios/de-acad-002.svg',
    './images/scenarios/de-acad-003.svg',
    './images/scenarios/de-acad-004.svg',
    './images/scenarios/de-acad-005.svg',
    './images/scenarios/de-acad-006.svg',
    './images/scenarios/de-acad-007.svg',
    './images/scenarios/de-acad-008.svg',
    './images/scenarios/de-acad-009.svg',
    './images/scenarios/de-acad-010.svg',
    './images/scenarios/de-soc-001.svg',
    './images/scenarios/de-soc-002.svg',
    './images/scenarios/de-soc-003.svg',
    './images/scenarios/de-soc-004.svg',
    './images/scenarios/de-soc-005.svg',
    './images/scenarios/de-soc-006.svg',
    './images/scenarios/de-soc-007.svg',
    './images/scenarios/de-soc-008.svg',
    './images/scenarios/de-soc-009.svg',
    './images/scenarios/de-soc-010.svg',
    './images/scenarios/de-emot-001.svg',
    './images/scenarios/de-emot-002.svg',
    './images/scenarios/de-emot-003.svg',
    './images/scenarios/de-emot-004.svg',
    './images/scenarios/de-emot-005.svg',
    './images/scenarios/de-emot-006.svg',
    './images/scenarios/de-emot-007.svg',
    './images/scenarios/de-emot-008.svg',
    './images/scenarios/de-emot-009.svg',
    './images/scenarios/de-emot-010.svg',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.all(
                APP_SHELL.map(url =>
                    cache.add(url).catch(err => console.warn('[SW] Failed to pre-cache:', url, err))
                )
            )
        ).then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    )
})

self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (CDN, Transformers.js model downloads)
    if (!event.request.url.startsWith(self.location.origin)) return

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful GET responses
                if (event.request.method === 'GET' && response.ok) {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                }
                return response
            })
            .catch(() => caches.match(event.request))
    )
})
