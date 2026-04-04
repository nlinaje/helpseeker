import { useRouter } from '../vue-router.js'
import { store }     from '../store.js'

const template = /* html */`
<div class="view home-view">
    <div class="container">

        <header class="app-header">
            <h1 class="app-title">🧮 MathStories</h1>
            <span class="progress-chip" v-if="store.progress.total > 0">
                {{ store.progress.correct }}/{{ store.progress.total }}
            </span>
        </header>

        <div class="card">
            <p style="font-size: 1.1rem; line-height: 1.65; color: var(--color-text); margin-bottom: 20px;">
                Lerne, welche Rechnung zu einer Geschichte passt!<br>
                Schritt für Schritt mit Bildern erklärt. 🎉
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="btn btn-primary" @click="start" aria-label="Aufgaben starten">
                    ▶ Aufgaben starten
                </button>
                <button
                    v-if="store.progress.total > 0"
                    class="btn btn-danger"
                    @click="reset"
                    aria-label="Fortschritt zurücksetzen"
                >
                    🗑 Fortschritt zurücksetzen
                </button>
            </div>
        </div>

        <div v-if="store.progress.total > 0" class="card" style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 900; color: var(--color-primary);">
                {{ store.progress.correct }}
            </div>
            <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 4px;">
                von {{ store.progress.total }} richtig gelöst
            </div>
            <div style="margin-top: 10px; background: var(--color-border); border-radius: var(--radius-full); height: 10px; overflow: hidden;">
                <div
                    :style="{ width: pct + '%', background: 'var(--color-primary)', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 0.5s' }"
                ></div>
            </div>
        </div>

    </div>
</div>
`

export default {
    name: 'HomeView',
    template,
    setup() {
        const router = useRouter()

        const pct = store.progress.total > 0
            ? Math.round((store.progress.correct / store.progress.total) * 100)
            : 0

        function start() {
            router.push('/exercise')
        }

        function reset() {
            if (confirm('Fortschritt wirklich zurücksetzen?')) {
                store.resetProgress()
            }
        }

        return { store, pct, start, reset }
    },
}
