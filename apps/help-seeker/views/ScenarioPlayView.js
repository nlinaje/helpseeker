import { ref, computed, onMounted, onUnmounted } from '../vue.js'
import { useRouter, useRoute } from '../vue-router.js'
import { store } from '../store.js'
import { characterEmoji, renderTemplate } from '../characters.js'
import { diceScore } from '../services/matcher.js'
import { characterName } from '../characters.js'
import * as speech from '../services/speech.js'
import * as db from '../services/db.js'

const template = /* html */`
<div class="view scenario-play-view">
    <div class="container">

        <!-- Header -->
        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>{{ scenario?.title }}</h1>
        </header>

        <div v-if="!scenario" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <template v-else>
            <!-- Scenario description card -->
            <div class="card scenario-description-card">
                <!-- Multi-panel storyboard (AI-generated images) -->
                <div
                    v-if="scenario.images && scenario.images.length > 0"
                    class="scenario-storyboard"
                    :class="'panels-' + scenario.images.length"
                >
                    <img
                        v-for="(src, i) in scenario.images"
                        :key="i"
                        :src="src"
                        :alt="scenario.title + ' – Bild ' + (i + 1)"
                        class="storyboard-panel"
                        @error="onPanelError($event, scenario.image)"
                    />
                </div>
                <!-- Fallback SVG illustration -->
                <div v-else-if="scenario.image" class="scenario-illustration">
                    <img :src="scenario.image" :alt="scenario.title" />
                </div>
                <div class="character-row">
                    <span class="character-avatar md">{{ companionEmoji }}</span>
                    <span class="companion-name">{{ companionNameText }}</span>
                </div>
                <p class="scenario-description-text">{{ description }}</p>
            </div>

            <!-- Mode toggle -->
            <div class="mode-toggle" role="tablist">
                <button
                    role="tab"
                    :aria-selected="mode === 'choice'"
                    class="mode-btn"
                    :class="{ active: mode === 'choice' }"
                    @click="switchMode('choice')"
                >
                    👆 Auswählen
                </button>
                <button
                    role="tab"
                    :aria-selected="mode === 'speech'"
                    class="mode-btn"
                    :class="{ active: mode === 'speech' }"
                    @click="switchMode('speech')"
                >
                    🎤 Sprechen
                </button>
            </div>

            <!-- ── Choice mode ── -->
            <div v-if="mode === 'choice'" class="card" role="tabpanel">
                <p class="choice-prompt">Was sagst du?</p>
                <div class="choices-list">
                    <button
                        v-for="choice in shuffledChoices"
                        :key="choice"
                        class="choice-btn"
                        :class="choiceState(choice)"
                        :disabled="choiceMade"
                        @click="selectChoice(choice)"
                        :aria-label="choice"
                    >
                        {{ choice }}
                    </button>
                </div>
                <p v-if="wrongChoice" class="feedback-text error">
                    Nicht ganz — versuch es nochmal! 💪
                </p>
            </div>

            <!-- ── Speech mode ── -->
            <div v-if="mode === 'speech'" class="card" role="tabpanel">

                <!-- Model not loaded -->
                <div v-if="!store.modelLoaded" class="model-load-section">
                    <p>Für die Spracherkennung muss der Assistent zuerst geladen werden.</p>
                    <button
                        class="btn btn-primary"
                        :disabled="store.modelLoading"
                        @click="loadModel"
                    >
                        {{ store.modelLoading ? 'Lade…' : '📥 Sprachassistent laden' }}
                    </button>
                    <div v-if="store.modelLoading" class="progress-bar" style="margin-top:12px;">
                        <div class="progress-fill" :style="{ width: store.modelProgress + '%' }"></div>
                    </div>
                </div>

                <!-- Model loaded — ready to record -->
                <div v-else>
                    <p class="speech-prompt">
                        Sprich deutlich:
                        <strong>{{ scenario.targetPhrase }}</strong>
                    </p>

                    <button
                        class="record-btn"
                        :class="{ recording: isRecording }"
                        :disabled="isTranscribing"
                        @click="toggleRecording"
                        :aria-label="isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'"
                    >
                        <span>{{ isRecording ? '⏹' : (isTranscribing ? '⏳' : '🎤') }}</span>
                        <span class="record-label">
                            {{ isRecording ? 'Tippe zum Stoppen' : (isTranscribing ? 'Verarbeite…' : 'Tippe zum Sprechen') }}
                        </span>
                    </button>

                    <div v-if="speechResult" class="speech-result" :class="speechResult.success ? 'success' : 'retry'">
                        <p class="transcript-text">&ldquo;{{ speechResult.text }}&rdquo;</p>
                        <p class="score-text">{{ Math.round(speechResult.score * 100) }}% Übereinstimmung</p>
                        <p v-if="!speechResult.success" class="retry-text">Probiere es nochmal! 💪</p>
                    </div>

                    <div v-if="speechError" style="background: var(--color-error-light); color: var(--color-error);
                        border-radius: var(--radius-md); padding: 12px; margin-top: 12px; font-weight:600;">
                        {{ speechError }}
                    </div>
                </div>
            </div>
        </template>

    </div>
</div>
`

export default {
    name: 'ScenarioPlayView',
    template,
    setup() {
        const router = useRouter()
        const route  = useRoute()

        // Guard
        if (!store.currentProfile) { router.replace('/'); return }

        const scenario     = ref(null)
        const mode         = ref('choice')
        const shuffledChoices = ref([])
        const choiceMade   = ref(false)
        const wrongChoice  = ref(null)
        const isRecording  = ref(false)
        const isTranscribing = ref(false)
        const speechResult = ref(null)
        const speechError  = ref('')

        // Derived
        const companionEmoji = characterEmoji(store.currentProfile.character)
        const description = computed(() =>
            scenario.value
                ? renderTemplate(scenario.value.description, store.currentProfile.character)
                : ''
        )
        const companionNameText = characterName(store.currentProfile.character)

        // Load scenario data
        onMounted(async () => {
            try {
                const res = await fetch('./data/scenarios.json')
                const data = await res.json()
                scenario.value = data.scenarios.find(s => s.id === route.params.id) ?? null
                if (scenario.value) {
                    shuffledChoices.value = [...scenario.value.choices].sort(() => Math.random() - 0.5)
                }
            } catch (err) {
                console.error('Failed to load scenario:', err)
            }
        })

        // Stop any in-progress recording when navigating away
        onUnmounted(() => {
            if (isRecording.value) {
                try { speech.stopRecording('', 'german') } catch (_) {}
                isRecording.value = false
            }
        })

        // ── Choice mode ──────────────────────────────────────────────────────

        function choiceState(choice) {
            if (!choiceMade.value) return {}
            if (choice === scenario.value.targetPhrase) return { correct: true }
            if (choice === wrongChoice.value)           return { wrong: true }
            return {}
        }

        async function selectChoice(choice) {
            if (choiceMade.value) return
            const correct = choice === scenario.value.targetPhrase
            if (correct) {
                choiceMade.value = true
                await saveAttempt('choice', 1)
                store.lastAttempt = { scenarioId: scenario.value.id, mode: 'choice', score: 1, text: choice }
                setTimeout(() => router.push('/celebrate'), 600)
            } else {
                wrongChoice.value = choice
                setTimeout(() => { wrongChoice.value = null }, 1200)
            }
        }

        // ── Speech mode ──────────────────────────────────────────────────────

        async function loadModel() {
            if (store.modelLoaded || store.modelLoading) return
            store.modelLoading = true
            store.modelProgress = 0
            try {
                await speech.loadModel('Xenova/whisper-tiny', (pct) => {
                    store.modelProgress = pct
                })
                store.modelLoaded = true
            } catch (err) {
                console.error('Model load failed:', err)
                speechError.value = 'Laden fehlgeschlagen. Bitte versuche es nochmal.'
            } finally {
                store.modelLoading = false
            }
        }

        async function toggleRecording() {
            if (isTranscribing.value) return
            speechError.value = ''
            speechResult.value = null

            if (!isRecording.value) {
                try {
                    await speech.startRecording()
                    isRecording.value = true
                } catch (err) {
                    speechError.value = 'Mikrofon nicht verfügbar. Bitte erlaube den Zugriff.'
                    console.error(err)
                }
            } else {
                isRecording.value = false
                isTranscribing.value = true
                try {
                    const { text, elapsed } = await speech.stopRecording(
                        scenario.value.targetPhrase,
                        'german'
                    )
                    const score = diceScore(text, scenario.value.targetPhrase)
                    const success = score >= 0.60
                    speechResult.value = { text, score, elapsed, success }

                    if (success) {
                        await saveAttempt('speech', score)
                        store.lastAttempt = { scenarioId: scenario.value.id, mode: 'speech', score, text }
                        setTimeout(() => router.push('/celebrate'), 1200)
                    }
                } catch (err) {
                    speechError.value = 'Transkription fehlgeschlagen: ' + err.message
                    console.error(err)
                } finally {
                    isTranscribing.value = false
                }
            }
        }

        // ── Shared ───────────────────────────────────────────────────────────

        async function saveAttempt(mode, score) {
            try {
                await db.saveAttempt({
                    id: crypto.randomUUID(),
                    profileId:  store.currentProfile.id,
                    scenarioId: scenario.value.id,
                    mode,
                    score,
                    timestamp: new Date().toISOString(),
                })
            } catch (err) {
                console.warn('Could not save attempt:', err)
            }
        }

        function switchMode(newMode) {
            mode.value       = newMode
            wrongChoice.value = null
            speechResult.value = null
            speechError.value  = ''
        }

        function onPanelError(event, fallbackSrc) {
            if (fallbackSrc) event.target.src = fallbackSrc
        }

        function goBack() {
            if (isRecording.value) {
                try { speech.stopRecording('', 'german') } catch (_) {}
                isRecording.value = false
            }
            router.push('/scenarios')
        }

        return {
            store,
            scenario,
            mode,
            shuffledChoices,
            choiceMade,
            wrongChoice,
            isRecording,
            isTranscribing,
            speechResult,
            speechError,
            companionEmoji,
            companionNameText,
            description,
            choiceState,
            selectChoice,
            loadModel,
            toggleRecording,
            onPanelError,
            switchMode,
            goBack,
        }
    }
}
