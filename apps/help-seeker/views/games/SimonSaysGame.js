import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const COLORS = [
    { id: 'r', hex: '#ef4444', label: 'Rot'   },
    { id: 'g', hex: '#22c55e', label: 'Grün'  },
    { id: 'b', hex: '#3b82f6', label: 'Blau'  },
    { id: 'y', hex: '#eab308', label: 'Gelb'  },
]

function randomId() { return COLORS[Math.floor(Math.random() * 4)].id }

const WIN_ROUND = 6  // win after completing sequence of length 6

const template = /* html */`
<div class="view simon-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🎮 Simon sagt</h1>
            <span class="memory-moves">Runde {{ round }}/{{ winRound }}</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🏆</div>
            <div class="win-title">Meister!</div>
            <div class="win-detail">Du hast alle Muster gemerkt!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="simon-status">{{ statusText }}</div>

        <div class="simon-board">
            <button
                v-for="c in simonColors"
                :key="c.id"
                class="simon-btn"
                :class="{
                    'active':       lit === c.id,
                    'simon-input':  phase === 'input',
                    'opt-wrong':    wrong === c.id,
                }"
                :style="{ background: c.hex }"
                @click="press(c.id)"
                :aria-label="c.label"
            ></button>
        </div>

    </div>
</div>`

export default {
    name: 'SimonSaysGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const simonColors = COLORS
        const winRound    = WIN_ROUND

        const sequence    = ref([])
        const round       = ref(1)
        const phase       = ref('showing')   // 'showing' | 'input' | 'wrong'
        const lit         = ref(null)
        const wrong       = ref(null)
        const inputIdx    = ref(0)
        const won         = ref(false)

        const statusText  = computed(() => {
            if (won.value)            return 'Du hast gewonnen!'
            if (phase.value === 'showing') return 'Schau genau!'
            if (phase.value === 'input')   return 'Dein Zug!'
            return ''
        })

        let showTimer = null

        function playSequence(seq) {
            phase.value = 'showing'
            inputIdx.value = 0
            let i = 0
            function next() {
                if (i >= seq.length) {
                    lit.value = null
                    setTimeout(() => { phase.value = 'input' }, 400)
                    return
                }
                lit.value = seq[i]
                showTimer = setTimeout(() => {
                    lit.value = null
                    setTimeout(() => { i++; next() }, 300)
                }, 600)
            }
            setTimeout(next, 500)
        }

        function nextRound() {
            const seq = [...sequence.value, randomId()]
            sequence.value = seq
            playSequence(seq)
        }

        function press(id) {
            if (phase.value !== 'input') return
            if (id === sequence.value[inputIdx.value]) {
                lit.value = id
                setTimeout(() => { lit.value = null }, 200)
                inputIdx.value++
                if (inputIdx.value >= sequence.value.length) {
                    // Completed round
                    if (round.value >= WIN_ROUND) {
                        won.value = true
                    } else {
                        round.value++
                        setTimeout(nextRound, 600)
                    }
                }
            } else {
                // Wrong — flash red, replay current sequence
                wrong.value = id
                phase.value = 'wrong'
                setTimeout(() => {
                    wrong.value = null
                    playSequence(sequence.value)
                }, 700)
            }
        }

        function restart() {
            clearTimeout(showTimer)
            sequence.value = []
            round.value = 1
            phase.value = 'showing'
            lit.value = null
            wrong.value = null
            inputIdx.value = 0
            won.value = false
            setTimeout(nextRound, 600)
        }

        function goBack() { clearTimeout(showTimer); router.push('/reward') }

        // Start first round
        setTimeout(nextRound, 800)

        return { simonColors, winRound, sequence, round, phase, lit, wrong, won, statusText, press, restart, goBack }
    },
}
