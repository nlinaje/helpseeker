import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

// Two categories: Tiere (animals) and Essen (food)
const ITEMS = [
    { emoji: '🐶', cat: 'tier',  label: 'Hund'     },
    { emoji: '🐱', cat: 'tier',  label: 'Katze'    },
    { emoji: '🐸', cat: 'tier',  label: 'Frosch'   },
    { emoji: '🦁', cat: 'tier',  label: 'Löwe'     },
    { emoji: '🐧', cat: 'tier',  label: 'Pinguin'  },
    { emoji: '🦊', cat: 'tier',  label: 'Fuchs'    },
    { emoji: '🍎', cat: 'essen', label: 'Apfel'    },
    { emoji: '🍕', cat: 'essen', label: 'Pizza'    },
    { emoji: '🍦', cat: 'essen', label: 'Eis'      },
    { emoji: '🥕', cat: 'essen', label: 'Karotte'  },
    { emoji: '🍰', cat: 'essen', label: 'Kuchen'   },
    { emoji: '🍓', cat: 'essen', label: 'Erdbeere' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

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
                class="sort-cat-btn"
                :class="{
                    'opt-correct': answered && current.cat === 'tier',
                    'opt-wrong':   answered && chose === 'tier' && current.cat !== 'tier',
                }"
                @click="sort('tier')"
                aria-label="Tier"
            >🐾<br>Tier</button>
            <button
                class="sort-cat-btn"
                :class="{
                    'opt-correct': answered && current.cat === 'essen',
                    'opt-wrong':   answered && chose === 'essen' && current.cat !== 'essen',
                }"
                @click="sort('essen')"
                aria-label="Essen"
            >🍽️<br>Essen</button>
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

        const total  = ITEMS.length
        const queue  = ref(shuffle(ITEMS))
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
            queue.value = shuffle(ITEMS)
            idx.value = 0
            chose.value = null
            answered.value = false
            correctCount.value = 0
        }

        function goBack() { router.push('/reward') }

        return { total, queue, idx, chose, answered, correctCount, current, won, sort, restart, goBack }
    },
}
