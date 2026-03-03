// ── Star computation ─────────────────────────────────────────────────────
//   Choice mode   → always 5 stars
//   Speech mode   → 5 + round(score × 10) stars  (5–15 range)

export function starsForAttempt(attempt) {
    if (!attempt) return 0
    return attempt.mode === 'speech'
        ? 5 + Math.round((attempt.score ?? 0) * 10)
        : 5
}

export function starsFromAttempts(attempts) {
    return attempts.reduce((sum, a) => sum + starsForAttempt(a), 0)
}

// ── Game catalog ─────────────────────────────────────────────────────────

export const GAMES = [
    {
        id: 'memory',
        title: 'Paare finden',
        emoji: '🃏',
        description: 'Finde zwei gleiche Karten!',
        starsRequired: 0,
        route: '/games/memory',
        color: '#6d28d9',
    },
    {
        id: 'bubbles',
        title: 'Zahlen-Blasen',
        emoji: '🫧',
        description: 'Tippe die Zahlen der Reihe nach!',
        starsRequired: 10,
        route: '/games/bubbles',
        color: '#0891b2',
    },
    {
        id: 'coming-soon',
        title: 'Kommt bald!',
        emoji: '🔮',
        description: 'Ein neues Spiel wartet auf dich.',
        starsRequired: 40,
        route: null,
        color: '#6b7280',
    },
]
