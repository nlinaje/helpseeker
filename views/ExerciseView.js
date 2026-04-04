import { ref, computed }  from '../vue.js'
import { useRouter }      from '../vue-router.js'
import { store }          from '../store.js'
import { buildExerciseQueue } from '../data/templates.js'
import ExplanationView    from './ExplanationView.js'

const template = /* html */`
<div class="view exercise-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goHome" aria-label="Zur Startseite">← Zurück</button>
            <h1>🧮 Rechengeschichte</h1>
            <span class="progress-chip" v-if="store.progress.total > 0">
                {{ store.progress.correct }}/{{ store.progress.total }}
            </span>
        </header>

        <!-- ── STATE: reading ──────────────────────────────── -->
        <transition name="fade" mode="out-in">
        <div v-if="state === 'reading'" key="reading" class="card">
            <p class="story-text">{{ exercise.story }}</p>
            <div class="action-buttons">
                <button class="btn btn-primary" @click="state = 'enter-result'" aria-label="Ergebnis eingeben">
                    ✏️ Ergebnis eingeben
                </button>
                <button class="btn btn-secondary" @click="state = 'choose-operation'" aria-label="Rechnung wählen">
                    🔢 Rechnung wählen
                </button>
                <button class="btn btn-explain" @click="state = 'explanation'" aria-label="Erklärung sehen">
                    💡 Erklärung sehen
                </button>
            </div>
        </div>

        <!-- ── STATE: enter-result ─────────────────────────── -->
        <div v-else-if="state === 'enter-result'" key="enter-result" class="card">
            <p class="story-text">{{ exercise.story }}</p>
            <input
                v-model="userInput"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                class="form-input"
                placeholder="?"
                aria-label="Ergebnis eingeben"
                @keyup.enter="submitResult"
            />
            <div class="action-buttons" style="margin-top: 12px;">
                <button class="btn btn-primary" @click="submitResult" aria-label="Antwort prüfen">
                    ✓ Prüfen
                </button>
                <button class="btn-back-link" @click="state = 'reading'" aria-label="Zurück zur Aufgabe">
                    ← Zurück
                </button>
            </div>
        </div>

        <!-- ── STATE: choose-operation ─────────────────────── -->
        <div v-else-if="state === 'choose-operation'" key="choose-op" class="card">
            <p class="story-text">{{ exercise.story }}</p>
            <p class="helper-text">Welche Rechnung passt zur Geschichte?</p>
            <div class="op-grid">
                <button
                    v-for="choice in opChoices"
                    :key="choice.op"
                    class="op-btn"
                    :disabled="!choice.possible"
                    @click="submitOperation(choice)"
                    :aria-label="choice.possible ? choice.expr : 'Nicht möglich'"
                >
                    {{ choice.possible ? choice.expr : choice.label + ' nicht möglich' }}
                </button>
            </div>
            <button class="btn-back-link" @click="state = 'reading'" aria-label="Zurück zur Aufgabe">
                ← Zurück
            </button>
        </div>

        <!-- ── STATE: explanation ──────────────────────────── -->
        <div v-else-if="state === 'explanation'" key="explanation">
            <ExplanationView :exercise="exercise" @done="state = 'reading'" />
        </div>

        <!-- ── STATE: feedback-correct ─────────────────────── -->
        <div v-else-if="state === 'feedback-correct'" key="feedback-correct" class="card feedback-panel correct">
            <span class="feedback-emoji">🎉</span>
            <p class="feedback-text correct-text">Super! Das ist richtig!</p>
        </div>

        <!-- ── STATE: feedback-wrong ───────────────────────── -->
        <div v-else-if="state === 'feedback-wrong'" key="feedback-wrong" class="card feedback-panel wrong">
            <span class="feedback-emoji">🤔</span>
            <p class="feedback-text wrong-text">Das war leider falsch.</p>
            <p style="margin-top: 8px; color: var(--color-text-secondary);">
                Die richtige Antwort ist <strong>{{ exercise.result }}</strong>.
            </p>
        </div>

        <!-- ── STATE: celebration ──────────────────────────── -->
        <div v-else-if="state === 'celebration'" key="celebration" class="card celebration-panel">
            <div class="falling-stars" aria-hidden="true">
                <span
                    v-for="n in 12"
                    :key="n"
                    class="star"
                    :style="starStyle(n)"
                >⭐</span>
            </div>
            <span class="cel-emoji">🏆</span>
            <h2 class="cel-title">Toll gemacht!</h2>
            <p class="cel-score">{{ store.progress.correct }} von {{ store.progress.total }} richtig</p>
            <button class="btn btn-primary" @click="nextExercise" aria-label="Nächste Aufgabe">
                Nächste Aufgabe →
            </button>
        </div>
        </transition>

    </div>
</div>
`

export default {
    name: 'ExerciseView',
    components: { ExplanationView },
    template,
    setup() {
        const router = useRouter()

        // Exercise queue
        const queue      = ref(buildExerciseQueue())
        const queueIndex = ref(0)
        const exercise   = computed(() => queue.value[queueIndex.value])

        // State machine
        const state     = ref('reading')
        const userInput = ref('')

        // 4 operation choices for choose-operation mode
        const opChoices = computed(() => {
            const { a, b } = exercise.value
            const divOk = b !== 0 && a % b === 0
            return [
                {
                    op: 'add',
                    label: '+',
                    expr: `${a} + ${b} = ${a + b}`,
                    possible: true,
                },
                {
                    op: 'subtract',
                    label: '−',
                    expr: `${a} − ${b} = ${a - b}`,
                    possible: a > b,
                },
                {
                    op: 'multiply',
                    label: '×',
                    expr: `${a} × ${b} = ${a * b}`,
                    possible: true,
                },
                {
                    op: 'divide',
                    label: '÷',
                    expr: divOk ? `${a} ÷ ${b} = ${a / b}` : '',
                    possible: divOk,
                },
            ]
        })

        function submitResult() {
            const answer = parseInt(userInput.value, 10)
            if (isNaN(answer)) return
            const correct = answer === exercise.value.result
            store.recordAttempt(correct)
            state.value = correct ? 'feedback-correct' : 'feedback-wrong'
            userInput.value = ''
            setTimeout(() => {
                state.value = correct ? 'celebration' : 'reading'
            }, correct ? 1500 : 2500)
        }

        function submitOperation(choice) {
            const correct = choice.op === exercise.value.template.operation
            store.recordAttempt(correct)
            state.value = correct ? 'feedback-correct' : 'feedback-wrong'
            setTimeout(() => {
                state.value = correct ? 'celebration' : 'reading'
            }, correct ? 1500 : 2500)
        }

        function nextExercise() {
            queueIndex.value++
            if (queueIndex.value >= queue.value.length) {
                queue.value = buildExerciseQueue()
                queueIndex.value = 0
            }
            state.value = 'reading'
        }

        function goHome() {
            router.push('/')
        }

        // Random star positions for celebration
        function starStyle(n) {
            const left     = (n * 8.33) % 100
            const delay    = (n * 0.37) % 2
            const duration = 1.5 + (n % 3) * 0.5
            return `left:${left}%; animation-duration:${duration}s; animation-delay:${delay}s;`
        }

        return {
            store,
            exercise,
            state,
            userInput,
            opChoices,
            submitResult,
            submitOperation,
            nextExercise,
            goHome,
            starStyle,
        }
    },
}
