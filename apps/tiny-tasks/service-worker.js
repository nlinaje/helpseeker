const CACHE_NAME = 'tiny-tasks-v1'

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
    './styles/main.css',
    './views/HomeView.js',
    './views/ExerciseView.js',
    './views/ExplanationView.js',
    './data/templates.js',
    './manifest.json',
    './icons/icon.svg',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    )
    self.skipWaiting()
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    )
    self.clients.claim()
})

self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok && event.request.method === 'GET') {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                }
                return response
            })
            .catch(() => caches.match(event.request))
    )
})
