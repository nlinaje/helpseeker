import { ref, computed } from '../vue.js'
import { useRouter } from '../vue-router.js'
import { getScenarioCategories, getAvailableScenarios, setScenarioAvailability, getEnabledScenarioCount, getTotalScenarioCount } from '../services/scenarios.js'

const template = /* html */`
<div class="view scenario-management-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>📚 Szenarios laden</h1>
        </header>

        <div class="card" style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px;">
                Verfügbare Szenarios
            </div>
            <div style="font-size: 28px; font-weight: bold; color: var(--color-primary);">
                {{ enabledCount }} / {{ totalCount }}
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 8px;">
                {{ totalCount - enabledCount }} Szenarios können hinzugefügt werden
            </div>
        </div>

        <h2 class="section-title">Kategorien</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div
                v-for="(category, catId) in categories"
                :key="catId"
                class="scenario-card card"
                :style="{ borderLeft: \`6px solid \${category.color}\` }"
            >
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 28px;">{{ category.emoji }}</span>
                            <div>
                                <div style="font-weight: 600; font-size: 16px;">{{ category.label }}</div>
                                <div style="font-size: 12px; color: var(--color-text-secondary);">
                                    {{ category.count }} Szenarios
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); margin-left: 40px;">
                            {{ availableScenarios[catId]?.enabled ? '✓ Aktiviert' : '⊘ Deaktiviert' }}
                        </div>
                    </div>
                    <button
                        class="toggle-btn"
                        :class="{ enabled: availableScenarios[catId]?.enabled }"
                        @click="toggleCategory(catId)"
                        :aria-label="(availableScenarios[catId]?.enabled ? 'Deaktivieren: ' : 'Aktivieren: ') + category.label"
                        :style="{
                            minWidth: '60px',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'all 0.2s',
                            background: availableScenarios[catId]?.enabled ? category.color : '#e5e7eb',
                            color: availableScenarios[catId]?.enabled ? 'white' : '#6b7280',
                        }"
                    >
                        {{ availableScenarios[catId]?.enabled ? '✓ An' : 'Aus' }}
                    </button>
                </div>
            </div>
        </div>

        <div style="margin-top: 24px; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0284c7;">
            <div style="font-size: 14px; font-weight: 600; color: #0284c7; margin-bottom: 8px;">
                💡 Tipp
            </div>
            <div style="font-size: 13px; color: #0c4a6e; line-height: 1.5;">
                Wähle die Kategorien, die du brauchen möchtest. Du kannst diese Einstellung jederzeit ändern.
                Szenarien, die du deaktivierst, werden in deinen Fortschritts-Listen nicht angezeigt.
            </div>
        </div>

        <button class="btn btn-primary" @click="goBack" style="margin-top: 24px; width: 100%;">
            ✓ Fertig
        </button>

    </div>
</div>
`

export default {
    name: 'ScenarioManagementView',
    template,
    setup() {
        const router = useRouter()
        const categories = ref(getScenarioCategories())
        const availableScenarios = ref(getAvailableScenarios())
        const enabledCount = computed(() => getEnabledScenarioCount())
        const totalCount = ref(getTotalScenarioCount())

        function toggleCategory(catId) {
            const current = availableScenarios.value[catId]?.enabled ?? true
            setScenarioAvailability(catId, !current)
            availableScenarios.value = getAvailableScenarios()
        }

        function goBack() {
            router.push('/')
        }

        return {
            categories,
            availableScenarios,
            enabledCount,
            totalCount,
            toggleCategory,
            goBack,
        }
    },
}
