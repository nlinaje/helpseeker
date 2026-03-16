import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const WORDS = [
    // 4-letter words
    { word: 'HAUS', emoji: '🏠', hint: 'Haus' },
    { word: 'BAUM', emoji: '🌳', hint: 'Baum' },
    { word: 'AUTO', emoji: '🚗', hint: 'Auto' },
    { word: 'BUCH', emoji: '📚', hint: 'Buch' },
    { word: 'BALL', emoji: '⚽', hint: 'Ball' },
    { word: 'HUND', emoji: '🐕', hint: 'Hund' },
    { word: 'BOOT', emoji: '⛵', hint: 'Boot' },
    { word: 'MOND', emoji: '🌙', hint: 'Mond' },
    // 5-letter words
    { word: 'BLUME', emoji: '🌸', hint: 'Blume' },
    { word: 'FISCH', emoji: '🐟', hint: 'Fisch' },
    { word: 'APFEL', emoji: '🍎', hint: 'Apfel' },
    { word: 'PIZZA', emoji: '🍕', hint: 'Pizza' },
    { word: 'MUSIK', emoji: '🎵', hint: 'Musik' },
    { word: 'SCHUH', emoji: '👞', hint: 'Schuh' },
    // 6-letter words
    { word: 'ORANGE', emoji: '🍊', hint: 'Orange' },
    { word: 'BUTTER', emoji: '🧈', hint: 'Butter' },
    { word: 'KARATE', emoji: '🥋', hint: 'Karate' },
    { word: 'TURNEN', emoji: '🤸', hint: 'Turnen' },
    { word: 'SCHULE', emoji: '🏫', hint: 'Schule' },
    { word: 'ZAHLEN', emoji: '🔢', hint: 'Zahlen' },
]

const DIFFICULTY_CONFIG = {
    easy: { wordLength: 4, roundCount: 6 },
    medium: { wordLength: 5, roundCount: 8 },
    hard: { wordLength: 6, roundCount: 8 },
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(entry) {
    const letters = shuffle(entry.word.split('')).map((ch, i) => ({ ch, id: i, used: false }))
    return { ...entry, letters, typed: [] }
}

function buildAllRounds(wordLength, roundCount) {
    const filtered = WORDS.filter(w => w.word.length === wordLength)
    return shuffle(filtered).slice(0, roundCount).map(buildRound)
}

const template = /* html */`
<div class="view wordbuild-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🔤 Wort-Puzzle</h1>
            <span class="memory-moves">{{ Math.min(idx + 1, roundCount) }}/{{ roundCount }}</span>
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
        <div v-if="difficulty !== 'hard'" class="word-hint">{{ current.hint }}</div>

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
            <span v-for="n in roundCount" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'WordBuildGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const difficulty = router.currentRoute.value.query.difficulty || store.currentProfile?.gameDifficulty || 'medium'
        const config = DIFFICULTY_CONFIG[difficulty]
        const wordLength = config.wordLength
        const roundCount = config.roundCount

        const rounds       = ref(buildAllRounds(wordLength, roundCount))
        const idx          = ref(0)
        const roundComplete = ref(false)
        const roundWrong    = ref(false)

        const current = computed(() => rounds.value[Math.min(idx.value, rounds.value.length - 1)])
        const won     = computed(() => idx.value >= roundCount)

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
            rounds.value = buildAllRounds(wordLength, roundCount)
            idx.value = 0
            roundComplete.value = false
            roundWrong.value = false
        }

        function goBack() { router.push('/reward') }

        return { idx, current, won, roundComplete, roundWrong, tapLetter, clearWord, restart, goBack, roundCount, difficulty }
    },
}
