import { createApp } from './vue.js'
import router        from './router.js'
import App           from './App.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

// PWA service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('[SW] registered'))
        .catch(err => console.warn('[SW] registration failed', err))
}
