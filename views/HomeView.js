import { ref, onMounted } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import * as db from '../services/db.js'
import { CHARACTER_TYPES } from '../characters.js'

const template = /* html */`
<div class="view home-view">
    <div class="container">
        <header class="app-header">
            <h1 class="app-title">🤝 HelpSeeker</h1>
            <span class="model-chip" :class="modelChipClass">
                {{ modelChipText }}
            </span>
        </header>

        <div v-if="loading" class="card" style="text-align:center; padding: 40px;">
            <span style="font-size:2rem;">⏳</span>
            <p style="margin-top:12px; color: var(--color-text-secondary);">Lade Profile...</p>
        </div>

        <div v-else-if="profiles.length === 0" class="empty-state">
            <div class="empty-icon">👶</div>
            <h2>Willkommen!</h2>
            <p>Erstelle ein Profil, um zu beginnen.</p>
            <button class="btn btn-primary" @click="goToCreate">
                ✨ Neues Profil erstellen
            </button>
        </div>

        <template v-else>
            <h2 class="section-title">Wer bist du?</h2>
            <div class="profiles-grid">
                <button
                    v-for="profile in profiles"
                    :key="profile.id"
                    class="profile-card"
                    @click="selectProfile(profile)"
                    :aria-label="'Profil ' + profile.name + ' auswählen'"
                >
                    <span class="character-avatar lg">{{ characterEmoji(profile.character) }}</span>
                    <span class="profile-name">{{ profile.name }}</span>
                </button>
            </div>
            <button class="btn btn-secondary" style="margin-top:8px;" @click="goToCreate">
                + Neues Profil
            </button>
        </template>
    </div>
</div>
`

export default {
    name: 'HomeView',
    template,
    setup() {
        const router = useRouter()
        const profiles = ref([])
        const loading = ref(true)

        onMounted(async () => {
            try {
                profiles.value = await db.getAllProfiles()
            } catch (err) {
                console.error('Failed to load profiles:', err)
            } finally {
                loading.value = false
            }
        })

        function characterEmoji(type) {
            return CHARACTER_TYPES[type]?.emoji ?? '🙂'
        }

        function goToCreate() {
            router.push('/profile/new')
        }

        function selectProfile(profile) {
            store.currentProfile = profile
            router.push('/scenarios')
        }

        const modelChipClass = {
            get loaded()  { return store.modelLoaded },
            get loading() { return store.modelLoading && !store.modelLoaded },
            get unloaded(){ return !store.modelLoaded && !store.modelLoading },
        }

        const modelChipText = {
            get value() {
                if (store.modelLoaded)  return '🟢 Spracherkennung bereit'
                if (store.modelLoading) return '⏳ Lade Spracherkennung…'
                return '⚪ Spracherkennung nicht geladen'
            }
        }

        return {
            profiles,
            loading,
            store,
            characterEmoji,
            goToCreate,
            selectProfile,
            modelChipClass: {
                get loaded()  { return store.modelLoaded },
                get loading() { return store.modelLoading },
                get unloaded(){ return !store.modelLoaded && !store.modelLoading },
            },
            get modelChipText() {
                if (store.modelLoaded)  return '🟢 Spracherkennung bereit'
                if (store.modelLoading) return '⏳ Lade…'
                return '⚪ Spracherkennung'
            },
        }
    }
}
