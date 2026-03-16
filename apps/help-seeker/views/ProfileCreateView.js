import { ref, computed } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { store } from '../store.js'
import * as db from '../services/db.js'
import { CHARACTER_TYPES, characterEmoji, characterName } from '../characters.js'

const template = /* html */`
<div class="view profile-create-view">
    <div class="container">
        <button class="btn-back" @click="goBack">← Zurück</button>

        <h1 class="page-title" style="margin-top:16px;">Neues Profil</h1>

        <div class="card">
            <label class="form-label" for="childName">Name des Kindes</label>
            <input
                id="childName"
                v-model="name"
                type="text"
                class="form-input"
                placeholder="z.B. Max"
                maxlength="20"
                autocomplete="off"
                autocorrect="off"
                aria-label="Name des Kindes"
            >
        </div>

        <div class="card">
            <label class="form-label">Wähle deinen Begleiter</label>
            <div class="character-grid">
                <button
                    v-for="(char, type) in characters"
                    :key="type"
                    class="character-option"
                    :class="{ selected: selectedCharacter === type }"
                    @click="selectedCharacter = type"
                    :aria-label="char.label + ' auswählen'"
                    :aria-pressed="selectedCharacter === type"
                >
                    <span class="char-emoji">{{ char.emoji }}</span>
                    <span class="char-label">{{ char.label }}</span>
                </button>
            </div>

            <div v-if="selectedCharacter" class="character-preview">
                <span class="preview-emoji">{{ characterEmoji(selectedCharacter) }}</span>
                <span class="preview-name">
                    {{ characterName(selectedCharacter) }} ist dein Begleiter!
                </span>
            </div>
        </div>

        <div class="card">
            <label class="form-label">Spiel-Schwierigkeit</label>
            <div class="difficulty-selector">
                <button
                    class="difficulty-option"
                    :class="{ selected: selectedDifficulty === 'easy' }"
                    @click="selectedDifficulty = 'easy'"
                    aria-label="Einfach auswählen"
                    :aria-pressed="selectedDifficulty === 'easy'"
                >
                    <span class="difficulty-emoji">🟢</span>
                    <span class="difficulty-label">Einfach</span>
                </button>
                <button
                    class="difficulty-option"
                    :class="{ selected: selectedDifficulty === 'medium' }"
                    @click="selectedDifficulty = 'medium'"
                    aria-label="Normal auswählen"
                    :aria-pressed="selectedDifficulty === 'medium'"
                >
                    <span class="difficulty-emoji">🟡</span>
                    <span class="difficulty-label">Normal</span>
                </button>
                <button
                    class="difficulty-option"
                    :class="{ selected: selectedDifficulty === 'hard' }"
                    @click="selectedDifficulty = 'hard'"
                    aria-label="Schwer auswählen"
                    :aria-pressed="selectedDifficulty === 'hard'"
                >
                    <span class="difficulty-emoji">🔴</span>
                    <span class="difficulty-label">Schwer</span>
                </button>
            </div>
        </div>

        <div v-if="error" style="background: var(--color-error-light); color: var(--color-error);
            border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 12px;
            font-weight: 600;">
            {{ error }}
        </div>

        <button
            class="btn btn-primary"
            :disabled="!canCreate || saving"
            @click="createProfile"
            aria-label="Profil erstellen"
        >
            {{ saving ? 'Erstelle…' : '✨ Profil erstellen' }}
        </button>
    </div>
</div>
`

export default {
    name: 'ProfileCreateView',
    template,
    setup() {
        const router = useRouter()
        const name = ref('')
        const selectedCharacter = ref(null)
        const selectedDifficulty = ref('medium')
        const saving = ref(false)
        const error = ref('')

        const canCreate = computed(() =>
            name.value.trim().length >= 1 && selectedCharacter.value !== null
        )

        async function createProfile() {
            if (!canCreate.value || saving.value) return
            saving.value = true
            error.value = ''
            try {
                const profile = {
                    id: crypto.randomUUID(),
                    name: name.value.trim(),
                    character: selectedCharacter.value,
                    gameDifficulty: selectedDifficulty.value,
                    createdAt: new Date().toISOString(),
                }
                await db.saveProfile(profile)
                store.currentProfile = profile
                router.push('/scenarios')
            } catch (err) {
                error.value = 'Fehler beim Erstellen. Bitte versuche es nochmal.'
                console.error(err)
            } finally {
                saving.value = false
            }
        }

        function goBack() {
            router.push('/')
        }

        return {
            name,
            selectedCharacter,
            selectedDifficulty,
            saving,
            error,
            canCreate,
            characters: CHARACTER_TYPES,
            characterEmoji,
            characterName,
            createProfile,
            goBack,
        }
    }
}
