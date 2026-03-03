import { ref, computed, onMounted } from '../vue.js'
import { useRouter, useRoute } from '../vue-router.js'
import * as db from '../services/db.js'
import { characterEmoji } from '../characters.js'

const CATEGORIES = [
    { id: 'physical',  label: 'Körperlich' },
    { id: 'academic',  label: 'Lernen'     },
    { id: 'social',    label: 'Sozial'     },
    { id: 'emotional', label: 'Gefühle'    },
]

const template = /* html */`
<div class="view therapist-child-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <div v-if="profile" class="therapist-child-header">
                <span class="character-avatar md">{{ characterEmoji(profile.character) }}</span>
                <div>
                    <div class="therapist-child-name">{{ profile.name }}</div>
                    <div class="therapist-child-since">Profil seit {{ formatDate(profile.createdAt) }}</div>
                </div>
            </div>
        </header>

        <div v-if="loading" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <template v-else>

            <!-- ── 4 Stat cards ── -->
            <div class="therapist-stats-grid">
                <div class="therapist-stat-card">
                    <div class="therapist-stat-value">{{ totalAttempts }}</div>
                    <div class="therapist-stat-label">Sitzungen</div>
                </div>
                <div class="therapist-stat-card">
                    <div class="therapist-stat-value">{{ uniqueScenarios }}</div>
                    <div class="therapist-stat-label">Szenarien</div>
                </div>
                <div class="therapist-stat-card">
                    <div class="therapist-stat-value">{{ speechAttempts }}</div>
                    <div class="therapist-stat-label">🎤 Sprechen</div>
                </div>
                <div class="therapist-stat-card">
                    <div class="therapist-stat-value">{{ activeDays }}</div>
                    <div class="therapist-stat-label">Tage aktiv</div>
                </div>
            </div>

            <!-- ── Activity chart — last 14 days ── -->
            <div class="card">
                <div class="therapist-section-title">Letzte 14 Tage</div>
                <div class="activity-chart" v-if="totalAttempts > 0">
                    <div
                        v-for="day in last14Days"
                        :key="day.date"
                        class="activity-bar-col"
                        :title="day.label + ': ' + day.count + ' Sitzung(en)'"
                    >
                        <div class="activity-bar-count" v-if="day.count > 0">{{ day.count }}</div>
                        <div class="activity-bar-fill" :style="{ height: barHeight(day.count) + 'px' }"></div>
                        <div class="activity-bar-label">{{ day.dayLabel }}</div>
                    </div>
                </div>
                <p v-else style="color:var(--color-text-secondary); font-size:0.9rem;">
                    Noch keine Sitzungen aufgezeichnet.
                </p>
            </div>

            <!-- ── Category coverage ── -->
            <div class="card">
                <div class="therapist-section-title">Fortschritt nach Kategorie</div>
                <div
                    v-for="cat in categoryData"
                    :key="cat.id"
                    class="category-coverage-row"
                >
                    <div class="category-coverage-header">
                        <span class="category-badge" :class="cat.id">{{ cat.label }}</span>
                        <span class="category-coverage-count">{{ cat.done }} / {{ cat.total }}</span>
                    </div>
                    <div class="scenario-chip-row">
                        <div
                            v-for="s in cat.scenarios"
                            :key="s.id"
                            class="scenario-chip"
                            :class="{ 'done': s.count >= 1, 'mastered': s.count >= 3 }"
                            :title="s.title + (s.count > 0 ? ' (' + s.count + 'x)' : ' — noch nicht versucht')"
                        ></div>
                    </div>
                </div>
                <div class="chip-legend">
                    <span class="chip-legend-item">
                        <span class="scenario-chip"></span> Nicht versucht
                    </span>
                    <span class="chip-legend-item">
                        <span class="scenario-chip done"></span> Geschafft
                    </span>
                    <span class="chip-legend-item">
                        <span class="scenario-chip mastered"></span> ≥ 3× geübt
                    </span>
                </div>
            </div>

            <!-- ── Mode distribution ── -->
            <div class="card" v-if="totalAttempts > 0">
                <div class="therapist-section-title">Modus-Verteilung</div>
                <div class="mode-split-bar">
                    <div
                        class="mode-split-choice"
                        :style="{ flex: choiceAttempts || 1 }"
                        v-if="choiceAttempts > 0"
                    >
                        👆 Auswählen · {{ choiceAttempts }}
                    </div>
                    <div
                        class="mode-split-speech"
                        :style="{ flex: speechAttempts || 0 }"
                        v-if="speechAttempts > 0"
                    >
                        🎤 Sprechen · {{ speechAttempts }}
                    </div>
                </div>
                <div class="mode-split-pct" v-if="speechAttempts > 0">
                    {{ Math.round(speechAttempts / totalAttempts * 100) }}% der Sitzungen mit Sprache
                </div>
            </div>

            <!-- ── Recent attempts ── -->
            <div class="card" v-if="recentAttempts.length > 0">
                <div class="therapist-section-title">Letzte Sitzungen</div>
                <div class="attempts-list">
                    <div v-for="a in recentAttempts" :key="a.id" class="attempt-row">
                        <span class="attempt-date">{{ formatShortDate(a.timestamp) }}</span>
                        <span class="attempt-title">{{ scenarioTitle(a.scenarioId) }}</span>
                        <span class="attempt-cat-badge category-badge" :class="scenarioCategory(a.scenarioId)"></span>
                        <span class="attempt-mode">{{ a.mode === 'speech' ? '🎤' : '👆' }}</span>
                        <span class="attempt-score" v-if="a.mode === 'speech'">
                            {{ Math.round(a.score * 100) }}%
                        </span>
                        <span class="attempt-score" v-else>✓</span>
                    </div>
                </div>
            </div>

        </template>

    </div>
</div>
`

export default {
    name: 'TherapistChildView',
    template,
    setup() {
        const router   = useRouter()
        const route    = useRoute()
        const profile  = ref(null)
        const attempts = ref([])
        const scenarios = ref([])
        const loading  = ref(true)

        onMounted(async () => {
            try {
                const [allProfiles, scenData] = await Promise.all([
                    db.getAllProfiles(),
                    fetch('./data/scenarios.json').then(r => r.json()),
                ])
                profile.value   = allProfiles.find(p => p.id === route.params.id) ?? null
                scenarios.value = scenData.scenarios

                if (profile.value) {
                    attempts.value = await db.getAttemptsForProfile(profile.value.id)
                }
            } catch (err) {
                console.error('[TherapistChild] load error:', err)
            } finally {
                loading.value = false
            }
        })

        // ── Aggregate stats ──────────────────────────────────────────────────

        const totalAttempts   = computed(() => attempts.value.length)
        const uniqueScenarios = computed(() => new Set(attempts.value.map(a => a.scenarioId)).size)
        const speechAttempts  = computed(() => attempts.value.filter(a => a.mode === 'speech').length)
        const choiceAttempts  = computed(() => attempts.value.filter(a => a.mode === 'choice').length)
        const activeDays      = computed(() =>
            new Set(attempts.value.map(a => a.timestamp.slice(0, 10))).size
        )

        // ── Last 14 days chart ───────────────────────────────────────────────

        const last14Days = computed(() => {
            const days = []
            const countByDay = {}
            for (const a of attempts.value) {
                const d = a.timestamp.slice(0, 10)
                countByDay[d] = (countByDay[d] ?? 0) + 1
            }
            const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
            for (let i = 13; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const dateStr = d.toISOString().slice(0, 10)
                days.push({
                    date:     dateStr,
                    label:    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
                    dayLabel: i === 0 ? 'Heute' : dayNames[d.getDay()],
                    count:    countByDay[dateStr] ?? 0,
                })
            }
            return days
        })

        const maxDayCount = computed(() =>
            Math.max(1, ...last14Days.value.map(d => d.count))
        )

        function barHeight(count) {
            return Math.round((count / maxDayCount.value) * 72)
        }

        // ── Category coverage ────────────────────────────────────────────────

        const categoryData = computed(() => {
            const countByScenario = {}
            for (const a of attempts.value) {
                countByScenario[a.scenarioId] = (countByScenario[a.scenarioId] ?? 0) + 1
            }
            return CATEGORIES.map(cat => {
                const catScenarios = scenarios.value
                    .filter(s => s.category === cat.id)
                    .map(s => ({ id: s.id, title: s.title, count: countByScenario[s.id] ?? 0 }))
                return {
                    ...cat,
                    scenarios: catScenarios,
                    done:  catScenarios.filter(s => s.count >= 1).length,
                    total: catScenarios.length,
                }
            })
        })

        // ── Recent attempts ──────────────────────────────────────────────────

        const recentAttempts = computed(() =>
            [...attempts.value]
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .slice(0, 15)
        )

        const scenarioMap = computed(() => {
            const m = {}
            for (const s of scenarios.value) m[s.id] = s
            return m
        })

        function scenarioTitle(id)    { return scenarioMap.value[id]?.title    ?? id }
        function scenarioCategory(id) { return scenarioMap.value[id]?.category ?? '' }

        // ── Formatting ───────────────────────────────────────────────────────

        function formatDate(iso) {
            if (!iso) return '—'
            return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        }

        function formatShortDate(iso) {
            if (!iso) return ''
            return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
        }

        function goBack() { router.push('/therapist') }

        return {
            profile, loading,
            totalAttempts, uniqueScenarios, speechAttempts, choiceAttempts, activeDays,
            last14Days, barHeight,
            categoryData,
            recentAttempts, scenarioTitle, scenarioCategory,
            formatDate, formatShortDate,
            goBack, characterEmoji,
        }
    },
}
