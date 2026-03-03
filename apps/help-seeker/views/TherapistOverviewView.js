import { ref, onMounted } from '../vue.js'
import { useRouter } from '../vue-router.js'
import * as db from '../services/db.js'
import { characterEmoji } from '../characters.js'

const TOTAL_SCENARIOS = 40

const template = /* html */`
<div class="view therapist-overview-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>⚕ Therapeuten-Übersicht</h1>
        </header>

        <div v-if="loading" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <div v-else-if="profiles.length === 0" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">👶</span>
            <p style="margin-top:12px; color:var(--color-text-secondary);">Noch keine Profile vorhanden.</p>
        </div>

        <div v-else class="therapist-profiles-list">
            <div
                v-for="profile in profiles"
                :key="profile.id"
                class="card therapist-profile-card"
                @click="goToChild(profile.id)"
                role="button"
                :aria-label="'Details für ' + profile.name"
            >
                <div class="therapist-profile-header">
                    <span class="character-avatar md">{{ characterEmoji(profile.character) }}</span>
                    <div class="therapist-profile-meta">
                        <span class="therapist-profile-name">{{ profile.name }}</span>
                        <span class="therapist-profile-since">Profil seit {{ formatDate(profile.createdAt) }}</span>
                    </div>
                    <span class="therapist-detail-arrow">→</span>
                </div>

                <div class="therapist-summary-stats">
                    <div class="therapist-summary-stat">
                        <span class="therapist-summary-value">{{ stats(profile.id).total }}</span>
                        <span class="therapist-summary-label">Sitzungen</span>
                    </div>
                    <div class="therapist-summary-stat">
                        <span class="therapist-summary-value">{{ stats(profile.id).unique }}</span>
                        <span class="therapist-summary-label">Szenarien</span>
                    </div>
                    <div class="therapist-summary-stat">
                        <span class="therapist-summary-value">{{ stats(profile.id).speech }}</span>
                        <span class="therapist-summary-label">🎤 Sprechen</span>
                    </div>
                    <div class="therapist-summary-stat">
                        <span class="therapist-summary-value">{{ stats(profile.id).days }}</span>
                        <span class="therapist-summary-label">Tage aktiv</span>
                    </div>
                </div>

                <div class="therapist-coverage-row">
                    <span class="therapist-coverage-label">Fortschritt</span>
                    <span class="therapist-coverage-fraction">
                        {{ stats(profile.id).unique }} / {{ TOTAL_SCENARIOS }} Szenarien
                    </span>
                </div>
                <div class="therapist-progress-track">
                    <div
                        class="therapist-progress-fill"
                        :style="{ width: (stats(profile.id).unique / TOTAL_SCENARIOS * 100) + '%' }"
                    ></div>
                </div>

                <div class="therapist-last-active">
                    Zuletzt aktiv: {{ formatDate(stats(profile.id).lastTimestamp) }}
                </div>
            </div>
        </div>

    </div>
</div>
`

export default {
    name: 'TherapistOverviewView',
    template,
    setup() {
        const router  = useRouter()
        const profiles = ref([])
        const allStats = ref({})   // profileId → computed stats object
        const loading  = ref(true)

        onMounted(async () => {
            try {
                const loaded = await db.getAllProfiles()
                profiles.value = loaded.sort((a, b) => a.name.localeCompare(b.name))

                for (const p of loaded) {
                    const attempts = await db.getAttemptsForProfile(p.id)
                    allStats.value[p.id] = computeStats(attempts)
                }
            } catch (err) {
                console.error('[Therapist] Failed to load data:', err)
            } finally {
                loading.value = false
            }
        })

        function computeStats(attempts) {
            const sorted = [...attempts].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
            return {
                total:         attempts.length,
                unique:        new Set(attempts.map(a => a.scenarioId)).size,
                speech:        attempts.filter(a => a.mode === 'speech').length,
                days:          new Set(attempts.map(a => a.timestamp.slice(0, 10))).size,
                lastTimestamp: sorted[0]?.timestamp ?? null,
            }
        }

        function stats(profileId) {
            return allStats.value[profileId] ?? { total: 0, unique: 0, speech: 0, days: 0, lastTimestamp: null }
        }

        function formatDate(iso) {
            if (!iso) return '—'
            return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        }

        function goToChild(id) { router.push(`/therapist/${id}`) }
        function goBack()       { router.push('/') }

        return { profiles, loading, stats, formatDate, goToChild, goBack, characterEmoji, TOTAL_SCENARIOS }
    },
}
