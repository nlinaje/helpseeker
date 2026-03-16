import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

// Categories: Tiere (animals), Essen (food), Farben (colors), Fahrzeuge (vehicles)
const ITEMS = [
    // Tiere
    { emoji: '🐶', cat: 'tier',  label: 'Hund'     },
    { emoji: '🐱', cat: 'tier',  label: 'Katze'    },
    { emoji: '🐸', cat: 'tier',  label: 'Frosch'   },
    { emoji: '🦁', cat: 'tier',  label: 'Löwe'     },
    { emoji: '🐧', cat: 'tier',  label: 'Pinguin'  },
    { emoji: '🦊', cat: 'tier',  label: 'Fuchs'    },
    // Essen
    { emoji: '🍎', cat: 'essen', label: 'Apfel'    },
    { emoji: '🍕', cat: 'essen', label: 'Pizza'    },
    { emoji: '🍦', cat: 'essen', label: 'Eis'      },
    { emoji: '🥕', cat: 'essen', label: 'Karotte'  },
    { emoji: '🍰', cat: 'essen', label: 'Kuchen'   },
    { emoji: '🍓', cat: 'essen', label: 'Erdbeere' },
    // Farben
    { emoji: '🔴', cat: 'farbe', label: 'Rot'      },
    { emoji: '🔵', cat: 'farbe', label: 'Blau'     },
    { emoji: '🟢', cat: 'farbe', label: 'Grün'     },
    { emoji: '🟡', cat: 'farbe', label: 'Gelb'     },
    { emoji: '🟣', cat: 'farbe', label: 'Lila'     },
    { emoji: '🟠', cat: 'farbe', label: 'Orange'   },
    // Fahrzeuge
    { emoji: '🚗', cat: 'auto',  label: 'Auto'     },
    { emoji: '🚕', cat: 'auto',  label: 'Taxi'     },
    { emoji: '🚙', cat: 'auto',  label: 'Jeep'     },
    { emoji: '🚌', cat: 'auto',  label: 'Bus'      },
]

const DIFFICULTY_CONFIG = {
    easy: { categoryCount: 2, itemCount: 6 },
    medium: { categoryCount: 3, itemCount: 9 },
    hard: { categoryCount: 4, itemCount: 12 },
}

const CATEGORIES = [
    { id: 'tier', label: 'Tier', emoji: '🐾' },
    { id: 'essen', label: 'Essen', emoji: '🍽️' },
    { id: 'farbe', label: 'Farbe', emoji: '🎨' },
    { id: 'auto', label: 'Fahrzeug', emoji: '🚗' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildRound(categoryCount, itemCount) {
    const catIds = CATEGORIES.slice(0, categoryCount).map(c => c.id)
    const filtered = ITEMS.filter(i => catIds.includes(i.cat))
    return shuffle(filtered).slice(0, itemCount)
}

const template = /* html */`
<div class="view sortgame-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🗂️ Sortier-Spaß</h1>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🎊</div>
            <div class="win-title">Perfekt sortiert!</div>
            <div class="win-detail">{{ correctCount }}/{{ total }} richtig!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="sort-score">{{ correctCount }} richtig · {{ idx }}/{{ total }}</div>

        <div class="sort-item" v-if="!won">{{ current.emoji }}</div>

        <div class="sort-categories" v-if="!won">
            <button
                v-for="cat in activeCategories"
                :key="cat.id"
                class="sort-cat-btn"
                :class="{
                    'opt-correct': answered && current.cat === cat.id,
                    'opt-wrong':   answered && chose === cat.id && current.cat !== cat.id,
                }"
                @click="sort(cat.id)"
                :aria-label="cat.label"
            >{{ cat.emoji }}<br>{{ cat.label }}</button>
        </div>

        <div class="bubble-progress" style="margin-top: 20px;">
            <span v-for="n in total" :key="n" class="bubble-dot" :class="{ popped: n <= idx }"></span>
        </div>

    </div>
</div>`

export default {
    name: 'SortGame',
    template,
    setup() {
        const router = useRouter()
        if (!store.currentProfile) { router.replace('/'); return {} }

        const difficulty = router.currentRoute.value.query.difficulty || store.currentProfile?.gameDifficulty || 'medium'
        const config = DIFFICULTY_CONFIG[difficulty]
        const categoryCount = config.categoryCount
        const itemCount = config.itemCount

        const activeCategories = CATEGORIES.slice(0, categoryCount)
        const total = itemCount
        const queue = ref(buildRound(categoryCount, itemCount))
        const idx    = ref(0)
        const chose  = ref(null)
        const answered  = ref(false)
        const correctCount = ref(0)

        const current = computed(() => queue.value[Math.min(idx.value, queue.value.length - 1)])
        const won     = computed(() => idx.value >= total)

        function sort(cat) {
            if (answered.value || won.value) return
            chose.value = cat
            answered.value = true
            if (cat === current.value.cat) correctCount.value++
            setTimeout(() => {
                idx.value++
                answered.value = false
                chose.value = null
            }, 700)
        }

        function restart() {
            queue.value = buildRound(categoryCount, itemCount)
            idx.value = 0
            chose.value = null
            answered.value = false
            correctCount.value = 0
        }

        function goBack() { router.push('/reward') }

        return { total, queue, idx, chose, answered, correctCount, current, won, sort, restart, goBack, activeCategories }
    },
}
