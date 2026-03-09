import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const COLORS = [
    { name: 'Rot',    hex: '#ef4444' },
    { name: 'Blau',   hex: '#3b82f6' },
    { name: 'Grün',   hex: '#22c55e' },
    { name: 'Gelb',   hex: '#eab308' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Lila',   hex: '#8b5cf6' },
    { name: 'Pink',   hex: '#ec4899' },
    { name: 'Türkis', hex: '#06b6d4' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRounds() {
    return shuffle(COLORS).map(target => ({
        target,
        options: shuffle([target, ...shuffle(COLORS.filter(c => c.name !== target.name)).slice(0, 3)]),
    }))
}

const template = /* html */`
<div class="view colormatch-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🎨 Farben-Rätsel</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🌈</div>
            <div class="win-title">Fantastisch!</div>
            <div class="win-detail">Du kennst alle Farben!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="colormatch-target card">
            <div class="colormatch-label">Zeige mir:</div>
            <div class="colormatch-name" :style="{ color: current.target.hex }">{{ current.target.name }}</div>
        </div>

        <div class="colormatch-grid">
            <button
                v-for="opt in current.options"
                :key="opt.name"
                class="colormatch-swatch"
                :class="{
                    'swatch-correct': answered && opt.name === current.target.name,
                    'swatch-wrong':   answered && chosen === opt.name && opt.name !== current.target.name,
                }"
                :style="{ background: opt.hex }"
                @click="pick(opt)"
                :aria-label="opt.name"
            ></button>
        </div>

        <div class="bubble-progress" style="margin-top: 20px;">
            <span v-for="n in 8" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'ColorMatchGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const rounds   = ref(buildRounds())
        const idx      = ref(0)
        const chosen   = ref(null)
        const answered = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= 8)

        function pick(opt) {
            if (answered.value || won.value) return
            chosen.value = opt.name
            answered.value = true
            setTimeout(() => {
                idx.value++
                answered.value = false
                chosen.value = null
            }, 800)
        }

        function restart() {
            rounds.value = buildRounds()
            idx.value = 0
            chosen.value = null
            answered.value = false
        }

        function goBack() { router.push('/reward') }

        return { idx, chosen, answered, current, won, pick, restart, goBack }
    },
}
