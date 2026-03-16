import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const EMOJIS = ['⭐', '🌸', '🍎', '🐶', '🚀', '🦋', '🍭', '🌈', '🎈', '🐸']

const DIFFICULTY_CONFIG = {
    easy: { maxCount: 5, roundCount: 8 },
    medium: { maxCount: 10, roundCount: 8 },
    hard: { maxCount: 15, roundCount: 8 },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(n, maxCount) {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const items = Array.from({ length: n }, () => emoji)
    const wrong = new Set()
    while (wrong.size < 2) {
        const d = n + Math.floor(Math.random() * 5) - 2
        if (d > 0 && d <= maxCount && d !== n) wrong.add(d)
    }
    return { n, emoji, items, options: shuffle([n, ...[...wrong]]) }
}

function buildAllRounds(maxCount, roundCount) {
    const available = Array.from({ length: maxCount }, (_, i) => i + 1)
    return shuffle(available).slice(0, roundCount).map(n => buildRound(n, maxCount))
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
            <span v-for="n in roundCount" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'CountGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const difficulty = router.currentRoute.value.query.difficulty || store.currentProfile?.gameDifficulty || 'medium'
        const config = DIFFICULTY_CONFIG[difficulty]
        const maxCount = config.maxCount
        const roundCount = config.roundCount

        const rounds   = ref(buildAllRounds(maxCount, roundCount))
        const idx      = ref(0)
        const chosen   = ref(null)
        const answered = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= roundCount)

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
            rounds.value = buildAllRounds(maxCount, roundCount)
            idx.value = 0
            chosen.value = null
            answered.value = false
        }

        function goBack() { router.push('/reward') }

        return { idx, chosen, answered, current, won, pick, restart, goBack, roundCount }
    },
}
