import { ref, computed, onMounted } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import { characterEmoji } from '../characters.js'

const CATEGORIES = [
    { id: 'physical',  label: 'Körperlich', emoji: '🏃', color: '#f97316', bg: '#fff7ed' },
    { id: 'academic',  label: 'Lernen',     emoji: '📚', color: '#3b82f6', bg: '#eff6ff' },
    { id: 'social',    label: 'Sozial',     emoji: '🤝', color: '#22c55e', bg: '#f0fdf4' },
    { id: 'emotional', label: 'Gefühle',    emoji: '💛', color: '#a855f7', bg: '#fdf4ff' },
]

const CATEGORY_LABELS = {
    physical:  'Körperlich',
    academic:  'Lernen',
    social:    'Sozial',
    emotional: 'Gefühle',
}

const template = /* html */`
<div class="view scenario-list-view">
    <div class="container">

        <!-- ── Header ── -->
        <header class="view-header">
            <button
                class="btn-back"
                @click="handleBack"
                :aria-label="selectedCategory ? 'Zurück zu Kategorien' : 'Abmelden'"
            >← {{ selectedCategory ? 'Zurück' : 'Abmelden' }}</button>

            <div class="profile-chip">
                <span class="character-avatar sm">{{ profileEmoji }}</span>
                <span>{{ store.currentProfile?.name }}</span>
            </div>

            <button class="btn-reward" @click="goToReward" aria-label="Belohnungsspiele">⭐</button>
        </header>

        <div v-if="loading" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <template v-else>

            <!-- ── Category overview ── -->
            <template v-if="!selectedCategory">
                <h1 class="page-title">Welches Thema willst du üben?</h1>

                <div class="category-cards">
                    <button
                        v-for="cat in CATEGORIES"
                        :key="cat.id"
                        class="category-card card"
                        :style="{ '--cat-color': cat.color, '--cat-bg': cat.bg }"
                        @click="openCategory(cat.id)"
                        :aria-label="cat.label + ', ' + scenariosInCategory(cat.id).length + ' Aufgaben'"
                    >
                        <div class="cat-card-icon" :style="{ background: cat.color }">
                            {{ cat.emoji }}
                        </div>
                        <div class="cat-card-body">
                            <div class="cat-card-title">{{ cat.label }}</div>
                            <div class="cat-card-count">{{ scenariosInCategory(cat.id).length }} Aufgaben</div>
                        </div>
                        <div class="cat-card-arrow" :style="{ color: cat.color }">▶</div>
                    </button>
                </div>
            </template>

            <!-- ── Scenario list for selected category ── -->
            <template v-else>
                <h1 class="page-title" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                    <span>{{ activeCategoryDef.emoji }}</span>
                    {{ activeCategoryDef.label }}
                </h1>

                <div class="scenarios-grid">
                    <button
                        v-for="scenario in filteredScenarios"
                        :key="scenario.id"
                        class="scenario-card"
                        @click="play(scenario)"
                        :aria-label="scenario.title"
                    >
                        <span class="scenario-emoji">{{ scenario.emoji }}</span>
                        <span class="scenario-title">{{ scenario.title }}</span>
                        <div class="difficulty-dots" :aria-label="'Schwierigkeit ' + scenario.difficulty">
                            <span
                                v-for="n in 5"
                                :key="n"
                                class="dot"
                                :class="{ active: n <= scenario.difficulty }"
                            ></span>
                        </div>
                    </button>
                </div>
            </template>

        </template>

    </div>
</div>
`

export default {
    name: 'ScenarioListView',
    template,
    setup() {
        const router           = useRouter()
        const scenarios        = ref([])
        const loading          = ref(true)
        const selectedCategory = ref(null)

        if (!store.currentProfile) {
            router.replace('/')
        }

        onMounted(async () => {
            try {
                const res  = await fetch('./data/scenarios.json')
                const data = await res.json()
                scenarios.value = data.scenarios
                // Restore selected category from store if it exists (e.g., returning from celebration)
                if (store.selectedCategory) {
                    selectedCategory.value = store.selectedCategory
                }
            } catch (err) {
                console.error('Failed to load scenarios:', err)
            } finally {
                loading.value = false
            }
        })

        const profileEmoji = characterEmoji(store.currentProfile?.character)

        function scenariosInCategory(catId) {
            return scenarios.value.filter(s => s.category === catId)
        }

        const filteredScenarios = computed(() =>
            selectedCategory.value
                ? scenarios.value.filter(s => s.category === selectedCategory.value)
                : []
        )

        const activeCategoryDef = computed(() =>
            CATEGORIES.find(c => c.id === selectedCategory.value) ?? CATEGORIES[0]
        )

        function openCategory(catId) {
            selectedCategory.value = catId
            store.selectedCategory = catId
        }

        function handleBack() {
            if (selectedCategory.value) {
                selectedCategory.value = null
                store.selectedCategory = null
            } else {
                store.currentProfile = null
                store.selectedCategory = null
                router.push('/')
            }
        }

        function play(scenario) {
            router.push(`/scenario/${scenario.id}`)
        }

        function goToReward() {
            router.push('/reward')
        }

        return {
            store,
            scenarios,
            loading,
            selectedCategory,
            CATEGORIES,
            filteredScenarios,
            activeCategoryDef,
            profileEmoji,
            scenariosInCategory,
            openCategory,
            handleBack,
            play,
            goToReward,
        }
    },
}
