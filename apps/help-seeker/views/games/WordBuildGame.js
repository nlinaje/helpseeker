import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const WORDS = [
    { word: 'HAUS', emoji: '🏠', hint: 'Haus' },
    { word: 'BAUM', emoji: '🌳', hint: 'Baum' },
    { word: 'AUTO', emoji: '🚗', hint: 'Auto' },
    { word: 'BUCH', emoji: '📚', hint: 'Buch' },
    { word: 'BALL', emoji: '⚽', hint: 'Ball' },
    { word: 'HUND', emoji: '🐕', hint: 'Hund' },
    { word: 'BOOT', emoji: '⛵', hint: 'Boot' },
    { word: 'MOND', emoji: '🌙', hint: 'Mond' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(entry) {
    const letters = shuffle(entry.word.split('')).map((ch, i) => ({ ch, id: i, used: false }))
    return { ...entry, letters, typed: [] }
}

function buildAllRounds() {
    return shuffle(WORDS).map(buildRound)
}

const template = /* html */`
<div class="view wordbuild-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🔤 Wort-Puzzle</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, 8) }}/8</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">📝</div>
            <div class="win-title">Klasse!</div>
            <div class="win-detail">Alle Wörter gelöst!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="word-emoji">{{ current.emoji }}</div>
        <div class="word-hint">{{ current.hint }}</div>

        <!-- Answer slots -->
        <div class="word-slots">
            <div
                v-for="(ch, i) in current.word"
                :key="i"
                class="word-slot"
                :class="{
                    'filled':       current.typed[i] !== undefined,
                    'slot-correct': roundComplete && current.typed[i] === ch,
                    'slot-wrong':   roundWrong,
                }"
            >{{ current.typed[i] || '' }}</div>
        </div>

        <!-- Letter buttons -->
        <div class="word-letters">
            <button
                v-for="l in current.letters"
                :key="l.id"
                class="word-letter-btn"
                :class="{ used: l.used }"
                @click="tapLetter(l)"
                :aria-label="'Buchstabe ' + l.ch"
            >{{ l.ch }}</button>
        </div>

        <div style="text-align:center; margin-top: 16px;">
            <button v-if="current.typed.length > 0 && !roundComplete" class="btn btn-secondary" @click="clearWord" aria-label="Löschen">
                ← Löschen
            </button>
        </div>

        <div class="bubble-progress" style="margin-top: 16px;">
            <span v-for="n in 8" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'WordBuildGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const rounds       = ref(buildAllRounds())
        const idx          = ref(0)
        const roundComplete = ref(false)
        const roundWrong    = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= 8)

        function tapLetter(letter) {
            if (letter.used || roundComplete.value || won.value) return
            letter.used = true
            current.value.typed.push(letter.ch)

            if (current.value.typed.length === current.value.word.length) {
                const correct = current.value.typed.join('') === current.value.word
                if (correct) {
                    roundComplete.value = true
                    setTimeout(() => {
                        idx.value++
                        roundComplete.value = false
                    }, 900)
                } else {
                    roundWrong.value = true
                    setTimeout(() => {
                        // Reset the round
                        roundWrong.value = false
                        current.value.typed = []
                        current.value.letters.forEach(l => { l.used = false })
                    }, 700)
                }
            }
        }

        function clearWord() {
            if (roundComplete.value) return
            current.value.typed = []
            current.value.letters.forEach(l => { l.used = false })
        }

        function restart() {
            rounds.value = buildAllRounds()
            idx.value = 0
            roundComplete.value = false
            roundWrong.value = false
        }

        function goBack() { router.push('/reward') }

        return { idx, current, won, roundComplete, roundWrong, tapLetter, clearWord, restart, goBack }
    },
}
