import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

// Fixed positions filling the play area (as percentages)
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

const COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
]

function buildBubbles() {
    // Shuffle positions so numbers appear in random spots each game
    const positions = [...POSITIONS].sort(() => Math.random() - 0.5)
    return Array.from({ length: 10 }, (_, i) => ({
        number:   i + 1,
        popped:   false,
        wrong:    false,
        color:    COLORS[i],
        left:     positions[i].left,
        top:      positions[i].top,
        duration: `${2 + (i % 4) * 0.5}s`,
        delay:    `${(i * 0.3) % 2}s`,
    }))
}

const template = /* html */`
<div class="view bubble-game-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🫧 Zahlen-Blasen</h1>
        </header>

        <!-- Win overlay -->
        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🎊</div>
            <div class="win-title">Bravo!</div>
            <div class="win-detail">Alle Blasen geplatzt!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <!-- Instruction chip -->
        <div class="bubble-instruction">
            Tippe auf
            <span class="bubble-next-number" :style="{ background: nextColor }">{{ nextNumber }}</span>
        </div>

        <!-- Play area -->
        <div class="bubble-area">
            <div
                v-for="bubble in bubbles"
                :key="bubble.number"
                class="bubble"
                :class="{ 'bubble-popped': bubble.popped, 'bubble-wrong': bubble.wrong }"
                :style="{
                    left:     bubble.left,
                    top:      bubble.top,
                    background: bubble.popped ? '#d1fae5' : bubble.color,
                    '--dur':  bubble.duration,
                    '--del':  bubble.delay,
                }"
                @click="popBubble(bubble)"
                role="button"
                :aria-label="'Zahl ' + bubble.number"
            >
                {{ bubble.popped ? '✓' : bubble.number }}
            </div>
        </div>

        <!-- Progress dots -->
        <div class="bubble-progress">
            <span
                v-for="n in 10"
                :key="n"
                class="bubble-dot"
                :class="{ popped: n < nextNumber }"
            ></span>
        </div>

    </div>
</div>
`

export default {
    name: 'BubbleGame',
    template,
    setup() {
        const router  = useRouter()

        if (!store.currentProfile) { router.replace('/'); return {} }

        const bubbles    = ref(buildBubbles())
        const nextNumber = ref(1)

        const won       = computed(() => nextNumber.value > 10)
        const nextColor = computed(() => {
            const b = bubbles.value.find(b => b.number === nextNumber.value)
            return b?.color ?? '#6d28d9'
        })

        function popBubble(bubble) {
            if (bubble.popped || won.value) return

            if (bubble.number === nextNumber.value) {
                bubble.popped = true
                nextNumber.value++
            } else {
                // Wrong bubble — shake briefly
                bubble.wrong = true
                setTimeout(() => { bubble.wrong = false }, 500)
            }
        }

        function restart() {
            bubbles.value    = buildBubbles()
            nextNumber.value = 1
        }

        function goBack() {
            router.push('/reward')
        }

        return { bubbles, nextNumber, nextColor, won, popBubble, restart, goBack }
    },
}
