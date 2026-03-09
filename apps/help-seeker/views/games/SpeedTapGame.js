import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const TARGETS = ['🌟', '🎈', '🍭', '🦋', '🚀', '🌈', '🎉', '⚡', '🍀', '💎']
const TOTAL   = 10
const LIVES   = 3

function randomPos() {
    return {
        left: `${5 + Math.random() * 75}%`,
        top:  `${5 + Math.random() * 75}%`,
    }
}

const template = /* html */`
<div class="view speedtap-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>⚡ Blitz-Tipper</h1>
            <span class="memory-moves">{{ hit }}/{{ total }}</span>
        </header>

        <div v-if="gameOver" class="win-overlay card">
            <div class="win-emoji">{{ won ? '🏆' : '😅' }}</div>
            <div class="win-title">{{ won ? 'Blitz-Profi!' : 'Schade!' }}</div>
            <div class="win-detail">{{ hit }} von {{ total }} getippt!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="speed-lives" :aria-label="'Leben: ' + lives">
            <span v-for="n in maxLives" :key="n">{{ n <= lives ? '❤️' : '🖤' }}</span>
        </div>

        <div class="speed-timer-bar">
            <div
                class="speed-timer-fill"
                :style="{
                    width: timerPct + '%',
                    background: timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#eab308' : '#ef4444',
                }"
            ></div>
        </div>

        <div class="speed-area">
            <div
                v-if="visible && !gameOver"
                class="speed-target"
                :style="{ left: pos.left, top: pos.top }"
                @click="tap"
                role="button"
                aria-label="Tippe mich!"
            >{{ emoji }}</div>
        </div>

        <div class="speed-score">Tippe das Emoji, bevor es verschwindet!</div>

    </div>
</div>`

export default {
    name: 'SpeedTapGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const total    = TOTAL
        const maxLives = LIVES

        const hit      = ref(0)
        const lives    = ref(LIVES)
        const round    = ref(0)
        const visible  = ref(false)
        const emoji    = ref('')
        const pos      = ref({ left: '40%', top: '40%' })
        const timerPct = ref(100)
        const gameOver = ref(false)

        const won = computed(() => hit.value >= TOTAL)

        let tickInterval = null
        let expireTimer  = null

        // Time window decreases from 2000ms → 1200ms over 10 rounds
        function roundDuration() { return 2000 - round.value * 80 }

        function startRound() {
            if (gameOver.value) return
            round.value++
            emoji.value   = TARGETS[Math.floor(Math.random() * TARGETS.length)]
            pos.value     = randomPos()
            timerPct.value = 100
            visible.value  = true

            const dur = roundDuration()
            const tick = 50

            tickInterval = setInterval(() => {
                timerPct.value = Math.max(0, timerPct.value - (tick / dur) * 100)
            }, tick)

            expireTimer = setTimeout(() => {
                clearInterval(tickInterval)
                visible.value = false
                lives.value--
                if (lives.value <= 0) {
                    gameOver.value = true
                } else {
                    setTimeout(startRound, 600)
                }
            }, dur)
        }

        function tap() {
            if (!visible.value || gameOver.value) return
            clearTimeout(expireTimer)
            clearInterval(tickInterval)
            visible.value = false
            hit.value++
            if (hit.value >= TOTAL) {
                gameOver.value = true
            } else {
                setTimeout(startRound, 500)
            }
        }

        function restart() {
            clearTimeout(expireTimer)
            clearInterval(tickInterval)
            hit.value      = 0
            lives.value    = LIVES
            round.value    = 0
            visible.value  = false
            timerPct.value = 100
            gameOver.value = false
            setTimeout(startRound, 600)
        }

        function goBack() {
            clearTimeout(expireTimer)
            clearInterval(tickInterval)
            router.push('/reward')
        }

        // Kick off
        setTimeout(startRound, 800)

        return { total, maxLives, hit, lives, round, visible, emoji, pos, timerPct, gameOver, won, tap, restart, goBack }
    },
}
