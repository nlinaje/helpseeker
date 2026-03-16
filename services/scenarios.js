// Scenario management: track which scenarios are downloaded/available

const SCENARIO_CATEGORIES = {
    'phys': { label: 'Körper & Bewegung', emoji: '🏃', count: 30, color: '#ef4444' },
    'acad': { label: 'Schule & Lernen', emoji: '📚', count: 30, color: '#3b82f6' },
    'soc': { label: 'Soziale Fähigkeiten', emoji: '🤝', count: 30, color: '#8b5cf6' },
    'emot': { label: 'Emotionen', emoji: '😊', count: 30, color: '#f59e0b' },
}

const STORAGE_KEY = 'helpseeker_scenarios'

export function getScenarioCategories() {
    return SCENARIO_CATEGORIES
}

export function getAvailableScenarios() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
        // Default: all scenarios available
        const defaults = {}
        Object.keys(SCENARIO_CATEGORIES).forEach(cat => {
            defaults[cat] = {
                enabled: true,
                downloaded: true,
                count: SCENARIO_CATEGORIES[cat].count,
            }
        })
        return defaults
    }
    return JSON.parse(stored)
}

export function setScenarioAvailability(categoryId, enabled) {
    const available = getAvailableScenarios()
    available[categoryId] = {
        ...available[categoryId],
        enabled,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(available))
}

export function getEnabledScenarioCount() {
    const available = getAvailableScenarios()
    return Object.entries(available)
        .filter(([_, data]) => data.enabled)
        .reduce((sum, [cat, data]) => sum + data.count, 0)
}

export function filterScenariosByAvailability(scenarios) {
    const available = getAvailableScenarios()
    return scenarios.filter(s => {
        // Extract category from scenario ID (e.g., "de-phys-001" → "phys")
        const match = s.id.match(/-(phys|acad|soc|emot)-/)
        if (!match) return true
        const category = match[1]
        return available[category]?.enabled !== false
    })
}

export function getTotalScenarioCount() {
    return Object.values(SCENARIO_CATEGORIES).reduce((sum, cat) => sum + cat.count, 0)
}
