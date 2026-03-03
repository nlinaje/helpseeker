import { ref, onMounted } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import { characterEmoji } from '../characters.js'

const CATEGORY_LABELS = {
    physical:  'Körperlich',
    academic:  'Lernen',
    social:    'Sozial',
    emotional: 'Gefühle',
}

const template = /* html */`
<div class="view scenario-list-view">
    <div class="container">
        <header class="view-header">
            <button class="btn-back" @click="signOut" aria-label="Abmelden">← Abmelden</button>
            <div class="profile-chip">
                <span class="character-avatar sm">{{ profileEmoji }}</span>
                <span>{{ store.currentProfile?.name }}</span>
            </div>
        </header>

        <h1 class="page-title">Welche Aufgabe willst du üben?</h1>

        <div v-if="loading" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <div v-else class="scenarios-grid">
            <button
                v-for="scenario in scenarios"
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
                <span class="category-badge" :class="scenario.category">
                    {{ categoryLabel(scenario.category) }}
                </span>
            </button>
        </div>
    </div>
</div>
`

export default {
    name: 'ScenarioListView',
    template,
    setup() {
        const router = useRouter()
        const scenarios = ref([])
        const loading = ref(true)

        // Guard: redirect to home if no active profile
        if (!store.currentProfile) {
            router.replace('/')
        }

        onMounted(async () => {
            try {
                const res = await fetch('./data/scenarios.json')
                const data = await res.json()
                scenarios.value = data.scenarios
            } catch (err) {
                console.error('Failed to load scenarios:', err)
            } finally {
                loading.value = false
            }
        })

        const profileEmoji = characterEmoji(store.currentProfile?.character)

        function categoryLabel(cat) {
            return CATEGORY_LABELS[cat] ?? cat
        }

        function play(scenario) {
            router.push(`/scenario/${scenario.id}`)
        }

        function signOut() {
            store.currentProfile = null
            router.push('/')
        }

        return {
            store,
            scenarios,
            loading,
            profileEmoji,
            categoryLabel,
            play,
            signOut,
        }
    }
}
