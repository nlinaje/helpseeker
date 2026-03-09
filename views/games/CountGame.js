import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const EMOJIS = ['⭐', '🌸', '🍎', '🐶', '🚀', '🦋', '🍭', '🌈', '🎈', '🐸']

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(n) {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const items = Array.from({ length: n }, () => emoji)
    const wrong = new Set()
    while (wrong.size < 2) {
        const d = n + Math.floor(Math.random() * 5) - 2
        if (d > 0 && d <= 10 && d !== n) wrong.add(d)
    }
    return { n, emoji, items, options: shuffle([n, ...[...wrong]]) }
}

function buildAllRounds() {
    return shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 8).map(buildRound)
}

const template = /* html */`
<div class="view countgame-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🔢 Zählen macht Spaß</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🎊</div>
            <div class="win-title">Toll gezählt!</div>
            <div class="win-detail">Du bist ein Mathe-Profi!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="count-display card">
            <div class="count-emoji-grid">
                <span v-for="(item, i) in current.items" :key="i" class="count-emoji">{{ item }}</span>
            </div>
            <div class="count-question">Wie viele sind es?</div>
        </div>

        <div class="count-options">
            <button
                v-for="opt in current.options"
                :key="opt"
                class="count-option-btn"
                :class="{
                    'opt-correct': answered && opt === current.n,
                    'opt-wrong':   answered && chosen === opt && opt !== current.n,
                }"
                @click="pick(opt)"
                :aria-label="'Antwort ' + opt"
            >{{ opt }}</button>
        </div>

        <div class="bubble-progress" style="margin-top: 20px;">
            <span v-for="n in 8" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'CountGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const rounds   = ref(buildAllRounds())
        const idx      = ref(0)
        const chosen   = ref(null)
        const answered = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= 8)

        function pick(opt) {
            if (answered.value || won.value) return
            chosen.value = opt
            answered.value = true
            setTimeout(() => {
                idx.value++
                answered.value = false
                chosen.value = null
            }, 800)
        }

        function restart() {
            rounds.value = buildAllRounds()
            idx.value = 0
            chosen.value = null
            answered.value = false
        }

        function goBack() { router.push('/reward') }

        return { idx, chosen, answered, current, won, pick, restart, goBack }
    },
}
