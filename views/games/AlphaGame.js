import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
]

const POSITIONS = [
    { left: '6%',  top: '8%'  },
    { left: '50%', top: '4%'  },
    { left: '78%', top: '12%' },
    { left: '26%', top: '28%' },
    { left: '68%', top: '28%' },
    { left: '4%',  top: '54%' },
    { left: '40%', top: '52%' },
    { left: '78%', top: '52%' },
    { left: '16%', top: '76%' },
    { left: '58%', top: '75%' },
]

function buildLetters() {
    const positions = [...POSITIONS].sort(() => Math.random() - 0.5)
    return LETTERS.map((ch, i) => ({
        ch,
        color:    COLORS[i],
        left:     positions[i].left,
        top:      positions[i].top,
        tapped:   false,
        wrong:    false,
        duration: `${2 + (i % 4) * 0.5}s`,
        delay:    `${(i * 0.3) % 2}s`,
    }))
}

const template = /* html */`
<div class="view alpha-game-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🔡 ABC-Jagd</h1>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🎉</div>
            <div class="win-title">ABC-Meister!</div>
            <div class="win-detail">Von A bis J — super!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="bubble-instruction">
            Tippe auf
            <span class="alpha-next">{{ nextLetter }}</span>
        </div>

        <div class="bubble-area">
            <div
                v-for="l in letters"
                :key="l.ch"
                class="bubble"
                :class="{ 'bubble-popped': l.tapped, 'bubble-wrong': l.wrong }"
                :style="{
                    left:     l.left,
                    top:      l.top,
                    background: l.tapped ? '#d1fae5' : l.color,
                    '--dur':  l.duration,
                    '--del':  l.delay,
                }"
                @click="tapLetter(l)"
                role="button"
                :aria-label="'Buchstabe ' + l.ch"
            >{{ l.tapped ? '✓' : l.ch }}</div>
        </div>

        <div class="bubble-progress">
            <span
                v-for="(ch, i) in allLetters"
                :key="ch"
                class="bubble-dot"
                :class="{ popped: i < nextIdx }"
            ></span>
        </div>

    </div>
</div>`

export default {
    name: 'AlphaGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const allLetters = LETTERS
        const letters    = ref(buildLetters())
        const nextIdx    = ref(0)

        const won        = computed(() => nextIdx.value >= LETTERS.length)
        const nextLetter = computed(() => LETTERS[nextIdx.value] ?? '✓')

        function tapLetter(l) {
            if (l.tapped || won.value) return
            if (l.ch === LETTERS[nextIdx.value]) {
                l.tapped = true
                nextIdx.value++
            } else {
                l.wrong = true
                setTimeout(() => { l.wrong = false }, 500)
            }
        }

        function restart() {
            letters.value = buildLetters()
            nextIdx.value = 0
        }

        function goBack() { router.push('/reward') }

        return { allLetters, letters, nextIdx, won, nextLetter, tapLetter, restart, goBack }
    },
}
