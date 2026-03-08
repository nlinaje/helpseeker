// Network-first strategy: always tries to get fresh content,
// falls back to cache when offline. Bump CACHE_NAME to force full refresh.

const CACHE_NAME = 'helpseeker-v6'

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
    './views/TherapistOverviewView.js',
    './views/TherapistChildView.js',
    './views/RewardView.js',
    './views/games/MemoryGame.js',
    './views/games/BubbleGame.js',
    './services/rewards.js',
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
    './images/scenarios/de-phys-011.svg',
    './images/scenarios/de-phys-012.svg',
    './images/scenarios/de-phys-013.svg',
    './images/scenarios/de-phys-014.svg',
    './images/scenarios/de-phys-015.svg',
    './images/scenarios/de-phys-016.svg',
    './images/scenarios/de-phys-017.svg',
    './images/scenarios/de-phys-018.svg',
    './images/scenarios/de-phys-019.svg',
    './images/scenarios/de-phys-020.svg',
    './images/scenarios/de-phys-021.svg',
    './images/scenarios/de-phys-022.svg',
    './images/scenarios/de-phys-023.svg',
    './images/scenarios/de-phys-024.svg',
    './images/scenarios/de-phys-025.svg',
    './images/scenarios/de-phys-026.svg',
    './images/scenarios/de-phys-027.svg',
    './images/scenarios/de-phys-028.svg',
    './images/scenarios/de-phys-029.svg',
    './images/scenarios/de-phys-030.svg',
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
    './images/scenarios/de-acad-011.svg',
    './images/scenarios/de-acad-012.svg',
    './images/scenarios/de-acad-013.svg',
    './images/scenarios/de-acad-014.svg',
    './images/scenarios/de-acad-015.svg',
    './images/scenarios/de-acad-016.svg',
    './images/scenarios/de-acad-017.svg',
    './images/scenarios/de-acad-018.svg',
    './images/scenarios/de-acad-019.svg',
    './images/scenarios/de-acad-020.svg',
    './images/scenarios/de-acad-021.svg',
    './images/scenarios/de-acad-022.svg',
    './images/scenarios/de-acad-023.svg',
    './images/scenarios/de-acad-024.svg',
    './images/scenarios/de-acad-025.svg',
    './images/scenarios/de-acad-026.svg',
    './images/scenarios/de-acad-027.svg',
    './images/scenarios/de-acad-028.svg',
    './images/scenarios/de-acad-029.svg',
    './images/scenarios/de-acad-030.svg',
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
    './images/scenarios/de-soc-011.svg',
    './images/scenarios/de-soc-012.svg',
    './images/scenarios/de-soc-013.svg',
    './images/scenarios/de-soc-014.svg',
    './images/scenarios/de-soc-015.svg',
    './images/scenarios/de-soc-016.svg',
    './images/scenarios/de-soc-017.svg',
    './images/scenarios/de-soc-018.svg',
    './images/scenarios/de-soc-019.svg',
    './images/scenarios/de-soc-020.svg',
    './images/scenarios/de-soc-021.svg',
    './images/scenarios/de-soc-022.svg',
    './images/scenarios/de-soc-023.svg',
    './images/scenarios/de-soc-024.svg',
    './images/scenarios/de-soc-025.svg',
    './images/scenarios/de-soc-026.svg',
    './images/scenarios/de-soc-027.svg',
    './images/scenarios/de-soc-028.svg',
    './images/scenarios/de-soc-029.svg',
    './images/scenarios/de-soc-030.svg',
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
    './images/scenarios/de-emot-011.svg',
    './images/scenarios/de-emot-012.svg',
    './images/scenarios/de-emot-013.svg',
    './images/scenarios/de-emot-014.svg',
    './images/scenarios/de-emot-015.svg',
    './images/scenarios/de-emot-016.svg',
    './images/scenarios/de-emot-017.svg',
    './images/scenarios/de-emot-018.svg',
    './images/scenarios/de-emot-019.svg',
    './images/scenarios/de-emot-020.svg',
    './images/scenarios/de-emot-021.svg',
    './images/scenarios/de-emot-022.svg',
    './images/scenarios/de-emot-023.svg',
    './images/scenarios/de-emot-024.svg',
    './images/scenarios/de-emot-025.svg',
    './images/scenarios/de-emot-026.svg',
    './images/scenarios/de-emot-027.svg',
    './images/scenarios/de-emot-028.svg',
    './images/scenarios/de-emot-029.svg',
    './images/scenarios/de-emot-030.svg',
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
