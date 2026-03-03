import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const EMOJIS = ['🌈', '⭐', '🎉', '🎈', '🍭', '🌺', '🦋', '🚀']

function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function buildDeck() {
    return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
        id: i,
        emoji,
        flipped:  false,
        matched:  false,
        shaking:  false,
    }))
}

const template = /* html */`
<div class="view memory-game-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🃏 Paare finden</h1>
            <div class="memory-moves">{{ moves }} Züge</div>
        </header>

        <!-- Win overlay -->
        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🎉</div>
            <div class="win-title">Gewonnen!</div>
            <div class="win-detail">{{ moves }} Züge — super gemacht!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <!-- Card grid -->
        <div class="memory-grid" :class="{ 'memory-checking': checking }">
            <div
                v-for="card in cards"
                :key="card.id"
                class="memory-card"
                :class="{
                    'is-flipped':  card.flipped || card.matched,
                    'is-matched':  card.matched,
                    'is-shaking':  card.shaking,
                }"
                @click="flip(card)"
                :aria-label="(card.flipped || card.matched) ? card.emoji : 'Karte'"
                role="button"
            >
                <div class="memory-card-inner">
                    <div class="memory-card-face memory-card-back">⭐</div>
                    <div class="memory-card-face memory-card-front">{{ card.emoji }}</div>
                </div>
            </div>
        </div>

        <div class="memory-bottom">
            <button class="btn btn-secondary" @click="restart">Neu mischen</button>
        </div>

    </div>
</div>
`

export default {
    name: 'MemoryGame',
    template,
    setup() {
        const router   = useRouter()

        if (!store.currentProfile) { router.replace('/'); return {} }

        const cards    = ref(buildDeck())
        const moves    = ref(0)
        const checking = ref(false)
        let   firstId  = null

        const matchedCount = computed(() => cards.value.filter(c => c.matched).length)
        const won          = computed(() => matchedCount.value === EMOJIS.length * 2)

        function flip(card) {
            if (checking.value)   return
            if (card.flipped)      return
            if (card.matched)      return

            card.flipped = true

            if (firstId === null) {
                firstId = card.id
                return
            }

            // Second card selected
            moves.value++
            const first  = cards.value.find(c => c.id === firstId)
            const second = card
            firstId      = null

            if (first.emoji === second.emoji) {
                // Match!
                first.matched  = true
                second.matched = true
            } else {
                // No match — flip back after short delay
                checking.value = true
                setTimeout(() => {
                    first.flipped  = false
                    second.flipped = false
                    checking.value = false
                }, 900)
            }
        }

        function restart() {
            cards.value    = buildDeck()
            moves.value    = 0
            checking.value = false
            firstId        = null
        }

        function goBack() {
            router.push('/reward')
        }

        return { cards, moves, checking, won, flip, restart, goBack }
    },
}
