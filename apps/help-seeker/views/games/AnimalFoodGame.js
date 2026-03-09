import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const PAIRS = [
    { animal: '🐄', food: '🌿', label: 'Gras' },
    { animal: '🐰', food: '🥕', label: 'Karotte' },
    { animal: '🐻', food: '🍯', label: 'Honig' },
    { animal: '🐝', food: '🌸', label: 'Blume' },
    { animal: '🐦', food: '🌱', label: 'Samen' },
    { animal: '🐸', food: '🐛', label: 'Insekt' },
    { animal: '🐿️', food: '🌰', label: 'Nuss' },
    { animal: '🦋', food: '🌺', label: 'Blüte' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(pair) {
    const distractors = shuffle(PAIRS.filter(p => p.food !== pair.food)).slice(0, 3).map(p => p.food)
    return { ...pair, options: shuffle([pair.food, ...distractors]) }
}

function buildAllRounds() {
    return shuffle(PAIRS).map(buildRound)
}

const template = /* html */`
<div class="view animalfood-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🍽️ Tier-Essen</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🐾</div>
            <div class="win-title">Wunderbar!</div>
            <div class="win-detail">Du kennst alle Tiere!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="animalfood-animal card">{{ current.animal }}</div>
        <div class="animalfood-question">Was isst dieses Tier?</div>

        <div class="animalfood-options">
            <button
                v-for="opt in current.options"
                :key="opt"
                class="animalfood-btn"
                :class="{
                    'opt-correct': answered && opt === current.food,
                    'opt-wrong':   answered && chosen === opt && opt !== current.food,
                }"
                @click="pick(opt)"
                :aria-label="'Option ' + opt"
            >{{ opt }}</button>
        </div>

        <div class="bubble-progress" style="margin-top: 20px;">
            <span v-for="n in 8" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'AnimalFoodGame',
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
