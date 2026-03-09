import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound() {
    const a   = Math.floor(Math.random() * 5) + 1   // 1–5
    const b   = Math.floor(Math.random() * 5) + 1   // 1–5
    const ans = a + b                                 // 2–10
    const wrong = new Set()
    while (wrong.size < 2) {
        const d = ans + Math.floor(Math.random() * 5) - 2
        if (d > 0 && d <= 12 && d !== ans) wrong.add(d)
    }
    return { a, b, ans, options: shuffle([ans, ...[...wrong]]) }
}

function buildAllRounds() {
    return Array.from({ length: 8 }, buildRound)
}

const template = /* html */`
<div class="view mathgame-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>➕ Mathe-Spaß</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🧮</div>
            <div class="win-title">Mathe-Genie!</div>
            <div class="win-detail">Alle Aufgaben gelöst!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="math-problem card">
            <div class="math-equation">{{ current.a }} + {{ current.b }} = ?</div>
        </div>

        <div class="math-options">
            <button
                v-for="opt in current.options"
                :key="opt"
                class="math-option-btn"
                :class="{
                    'opt-correct': answered && opt === current.ans,
                    'opt-wrong':   answered && chosen === opt && opt !== current.ans,
                }"
                @click="pick(opt)"
                :aria-label="'Antwort ' + opt"
            >{{ opt }}</button>
        </div>

        <div class="bubble-progress" style="margin-top: 24px;">
            <span v-for="n in 8" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'MathGame',
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
