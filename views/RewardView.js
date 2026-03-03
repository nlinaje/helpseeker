import { ref, computed, onMounted } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import * as db from '../services/db.js'
import { GAMES, starsFromAttempts } from '../services/rewards.js'

const template = /* html */`
<div class="view reward-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>⭐ Belohnung</h1>
        </header>

        <div v-if="loading" class="card" style="text-align:center; padding:40px;">
            <span style="font-size:2rem;">⏳</span>
        </div>

        <template v-else>

            <!-- Stars banner -->
            <div class="stars-banner card">
                <div class="stars-banner-icon">⭐</div>
                <div class="stars-banner-text">
                    <div class="stars-banner-count">{{ totalStars }}</div>
                    <div class="stars-banner-label">Sterne gesammelt</div>
                </div>
                <div class="stars-banner-hint" v-if="totalStars === 0">
                    Löse Aufgaben, um Sterne zu sammeln!
                </div>
            </div>

            <!-- Games -->
            <h2 class="section-title">Deine Spiele</h2>
            <div class="games-grid">
                <div
                    v-for="game in GAMES"
                    :key="game.id"
                    class="game-card card"
                    :class="{ 'game-locked': totalStars < game.starsRequired }"
                    @click="playGame(game)"
                    role="button"
                    :aria-label="game.title + (totalStars < game.starsRequired ? ', gesperrt, noch ' + (game.starsRequired - totalStars) + ' Sterne nötig' : '')"
                >
                    <div class="game-card-emoji" :style="{ background: totalStars >= game.starsRequired ? game.color : '#e5e7eb' }">
                        {{ totalStars >= game.starsRequired ? game.emoji : '🔒' }}
                    </div>
                    <div class="game-card-body">
                        <div class="game-card-title">{{ game.title }}</div>
                        <div class="game-card-desc">{{ game.description }}</div>
                        <div v-if="totalStars < game.starsRequired" class="game-card-lock">
                            Noch {{ game.starsRequired - totalStars }} ⭐ nötig
                        </div>
                    </div>
                    <div v-if="totalStars >= game.starsRequired && game.route" class="game-card-arrow">▶</div>
                </div>
            </div>

        </template>

    </div>
</div>
`

export default {
    name: 'RewardView',
    template,
    setup() {
        const router = useRouter()

        if (!store.currentProfile) {
            router.replace('/')
            return {}
        }

        const attempts = ref([])
        const loading  = ref(true)

        onMounted(async () => {
            try {
                attempts.value = await db.getAttemptsForProfile(store.currentProfile.id)
            } catch (err) {
                console.error('[RewardView] load error:', err)
            } finally {
                loading.value = false
            }
        })

        const totalStars = computed(() => starsFromAttempts(attempts.value))

        function playGame(game) {
            if (totalStars.value < game.starsRequired || !game.route) return
            router.push(game.route)
        }

        function goBack() {
            router.push('/scenarios')
        }

        return { loading, totalStars, GAMES, playGame, goBack }
    },
}
