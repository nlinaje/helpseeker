import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const PALETTE = [
    { id: 'r', hex: '#ef4444', label: 'Rot'   },
    { id: 'g', hex: '#22c55e', label: 'Grün'  },
    { id: 'b', hex: '#3b82f6', label: 'Blau'  },
    { id: 'y', hex: '#eab308', label: 'Gelb'  },
    { id: 'p', hex: '#8b5cf6', label: 'Lila'  },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function randomColor() { return PALETTE[Math.floor(Math.random() * PALETTE.length)] }

const DIFFICULTY_CONFIG = {
    easy: { minLength: 2, maxLength: 3, roundCount: 6 },
    medium: { minLength: 3, maxLength: 5, roundCount: 8 },
    hard: { minLength: 4, maxLength: 6, roundCount: 8 },
}

function buildRound(length) {
    const pattern = Array.from({ length }, randomColor)
    return { pattern, answer: Array(length).fill(null), length }
}

function buildAllRounds(minLength, maxLength, roundCount) {
    const lengths = []
    for (let i = 0; i < roundCount; i++) {
        lengths.push(minLength + Math.floor((maxLength - minLength) * i / roundCount))
    }
    return lengths.map(buildRound)
}

const template = /* html */`
<div class="view pattern-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🔵 Muster-Zauberer</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">✨</div>
            <div class="win-title">Zauberhaft!</div>
            <div class="win-detail">Alle Muster nachgemalt!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="pattern-label">Merke dir das Muster:</div>
        <div class="pattern-display">
            <div
                v-for="(c, i) in current.pattern"
                :key="i"
                class="pattern-dot"
                :style="{ background: c.hex }"
                :aria-label="c.label"
            ></div>
        </div>

        <div class="pattern-label" style="margin-top: 16px;">Jetzt du! Tippe die Farben:</div>
        <div class="pattern-answer">
            <div
                v-for="(slot, i) in current.answer"
                :key="i"
                class="pattern-answer-dot"
                :class="{
                    'filled':       slot !== null,
                    'pat-correct':  roundComplete,
                    'pat-wrong':    roundWrong,
                }"
                :style="slot ? { background: slot.hex } : {}"
                @click="clearSlot(i)"
                :aria-label="slot ? slot.label : 'Leer'"
            ></div>
        </div>

        <div class="pattern-palette">
            <button
                v-for="c in palette"
                :key="c.id"
                class="pattern-color-btn"
                :style="{ background: c.hex }"
                @click="paintColor(c)"
                :aria-label="c.label"
            ></button>
        </div>

        <div class="bubble-progress" style="margin-top: 20px;">
            <span v-for="n in roundCount" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'PatternGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const difficulty = router.currentRoute.value.query.difficulty || store.currentProfile?.gameDifficulty || 'medium'
        const config = DIFFICULTY_CONFIG[difficulty]
        const minLength = config.minLength
        const maxLength = config.maxLength
        const roundCount = config.roundCount

        const palette       = PALETTE
        const rounds        = ref(buildAllRounds(minLength, maxLength, roundCount))
        const idx           = ref(0)
        const roundComplete = ref(false)
        const roundWrong    = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= roundCount)

        function paintColor(color) {
            if (roundComplete.value || won.value) return
            const slot = current.value.answer.indexOf(null)
            if (slot === -1) return
            current.value.answer[slot] = color

            // Check if answer is full
            if (!current.value.answer.includes(null)) {
                const correct = current.value.answer.every((c, i) => c.id === current.value.pattern[i].id)
                if (correct) {
                    roundComplete.value = true
                    setTimeout(() => {
                        idx.value++
                        roundComplete.value = false
                    }, 900)
                } else {
                    roundWrong.value = true
                    setTimeout(() => {
                        roundWrong.value = false
                        current.value.answer.fill(null)
                    }, 700)
                }
            }
        }

        function clearSlot(i) {
            if (roundComplete.value) return
            // Remove this slot and everything after (like a backspace from end)
            const firstFilled = current.value.answer.findLastIndex(s => s !== null)
            if (firstFilled >= 0) {
                current.value.answer[firstFilled] = null
            }
        }

        function restart() {
            rounds.value = buildAllRounds(minLength, maxLength, roundCount)
            idx.value = 0
            roundComplete.value = false
            roundWrong.value = false
        }

        function goBack() { router.push('/reward') }

        return { palette, idx, current, won, roundComplete, roundWrong, paintColor, clearSlot, restart, goBack, roundCount }
    },
}
