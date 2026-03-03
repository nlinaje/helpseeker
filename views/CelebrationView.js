import { computed } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import { characterEmoji } from '../characters.js'

// Randomly placed falling stars
function starStyle(n) {
    const left     = (n * 37 + 11) % 100
    const duration = 2 + (n % 4) * 0.7
    const delay    = (n * 0.3) % 2
    const size     = 1 + (n % 3) * 0.5
    return {
        left:                `${left}%`,
        animationDuration:   `${duration}s`,
        animationDelay:      `${delay}s`,
        fontSize:            `${size}rem`,
    }
}

const template = /* html */`
<div class="view celebration-view">

    <!-- Raining stars -->
    <div class="stars-layer" aria-hidden="true">
        <span
            v-for="n in 22"
            :key="n"
            class="falling-star"
            :style="starStyle(n)"
        >⭐</span>
    </div>

    <div class="celebration-content">
        <span class="celebration-character" aria-hidden="true">{{ companionEmoji }}</span>

        <h1 class="celebration-title">Toll gemacht! 🎉</h1>
        <p class="celebration-subtitle">Du hast um Hilfe gebeten!</p>

        <div v-if="score !== null" class="celebration-score" aria-label="Ergebnis">
            {{ Math.round(score * 100) }}% Übereinstimmung
        </div>

        <button
            class="btn btn-celebration"
            @click="goToScenarios"
            aria-label="Weiter zu den Aufgaben"
        >
            Weiter →
        </button>
    </div>
</div>
`

export default {
    name: 'CelebrationView',
    template,
    setup() {
        const router = useRouter()

        if (!store.currentProfile) { router.replace('/'); return }

        const companionEmoji = characterEmoji(store.currentProfile.character)

        const score = computed(() => {
            const s = store.lastAttempt?.score
            return (s !== undefined && s !== null && store.lastAttempt?.mode === 'speech')
                ? s
                : null
        })

        function goToScenarios() {
            store.lastAttempt = null
            router.push('/scenarios')
        }

        return {
            companionEmoji,
            score,
            goToScenarios,
            starStyle,
        }
    }
}
