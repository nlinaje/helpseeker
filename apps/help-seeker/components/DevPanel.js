import { ref } from '../vue.js'
import { isDevMode, createTestProfile, resetAllData, clearServiceWorkerCache, bumpServiceWorkerVersion } from '../services/dev.js'

const template = /* html */`
<div v-if="showDevPanel" class="dev-panel" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1f2937;
    color: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
    z-index: 9999;
    font-size: 12px;
    font-family: monospace;
">
    <div style="margin-bottom: 12px; font-weight: bold; border-bottom: 1px solid #4b5563; padding-bottom: 8px;">
        🛠️ DEV MODE
    </div>

    <div style="margin-bottom: 12px;">
        <button
            @click="handleCreateTestProfile"
            style="
                display: block;
                width: 100%;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 8px;
                font-size: 11px;
                font-weight: bold;
            "
        >
            ✨ Testprofil (150 Sterne)
        </button>

        <button
            @click="handleCreateTestProfileEasy"
            style="
                display: block;
                width: 100%;
                background: #059669;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 8px;
                font-size: 11px;
            "
        >
            🟢 Easy (150 Sterne)
        </button>

        <button
            @click="handleCreateTestProfileHard"
            style="
                display: block;
                width: 100%;
                background: #dc2626;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 8px;
                font-size: 11px;
            "
        >
            🔴 Hard (150 Sterne)
        </button>
    </div>

    <div style="margin-bottom: 12px; border-top: 1px solid #4b5563; padding-top: 8px;">
        <button
            @click="handleClearCache"
            style="
                display: block;
                width: 100%;
                background: #f59e0b;
                color: white;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 6px;
                font-size: 11px;
            "
        >
            🧹 Cache löschen
        </button>

        <button
            @click="handleResetData"
            style="
                display: block;
                width: 100%;
                background: #ef4444;
                color: white;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            "
        >
            🗑️ Alle Daten löschen
        </button>
    </div>

    <div style="border-top: 1px solid #4b5563; padding-top: 8px; font-size: 10px; color: #9ca3af;">
        <p style="margin: 0 0 6px 0;">📋 Tipp: Bump CACHE_NAME in service-worker.js auf neue Version.</p>
        <button
            @click="handleBumpVersion"
            style="
                display: block;
                width: 100%;
                background: #6366f1;
                color: white;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            "
        >
            📝 Bump-Hinweis
        </button>
    </div>

    <button
        @click="toggleDevPanel"
        style="
            position: absolute;
            top: 4px;
            right: 4px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
        "
        title="Dev Panel schließen"
    >
        ✕
    </button>
</div>

<button
    v-else-if="canAccessDevMode"
    @click="toggleDevPanel"
    style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #1f2937;
        color: #f3f4f6;
        border: 2px solid #4b5563;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    "
    @mouseenter="scale = 1.1"
    @mouseleave="scale = 1"
    :style="{ transform: \`scale(\${scale})\` }"
    title="Dev Mode öffnen (Klick)"
>
    🛠️
</button>
`

export default {
    name: 'DevPanel',
    template,
    setup() {
        const showDevPanel = ref(isDevMode())
        const scale = ref(1)

        function toggleDevPanel() {
            showDevPanel.value = !showDevPanel.value
        }

        async function handleCreateTestProfile() {
            const profile = await createTestProfile('Test User', 'dog', 'medium', 150)
            alert(`✓ Profil erstellt: ${profile.name} (${profile.gameDifficulty})`)
            setTimeout(() => window.location.reload(), 500)
        }

        async function handleCreateTestProfileEasy() {
            const profile = await createTestProfile('Easy Test', 'cat', 'easy', 150)
            alert(`✓ Profil erstellt: ${profile.name} (${profile.gameDifficulty})`)
            setTimeout(() => window.location.reload(), 500)
        }

        async function handleCreateTestProfileHard() {
            const profile = await createTestProfile('Hard Test', 'bird', 'hard', 150)
            alert(`✓ Profil erstellt: ${profile.name} (${profile.gameDifficulty})`)
            setTimeout(() => window.location.reload(), 500)
        }

        function handleClearCache() {
            clearServiceWorkerCache()
        }

        function handleResetData() {
            resetAllData()
        }

        function handleBumpVersion() {
            bumpServiceWorkerVersion()
        }

        const canAccessDevMode = isDevMode()

        return {
            showDevPanel,
            scale,
            canAccessDevMode,
            toggleDevPanel,
            handleCreateTestProfile,
            handleCreateTestProfileEasy,
            handleCreateTestProfileHard,
            handleClearCache,
            handleResetData,
            handleBumpVersion,
        }
    },
}
