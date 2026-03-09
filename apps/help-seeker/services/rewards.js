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
        id: 'colormatch',
        title: 'Farben-Rätsel',
        emoji: '🎨',
        description: 'Zeige die richtige Farbe!',
        starsRequired: 20,
        route: '/games/colormatch',
        color: '#dc2626',
    },
    {
        id: 'count',
        title: 'Zählen macht Spaß',
        emoji: '🔢',
        description: 'Zähle und tippe die richtige Zahl!',
        starsRequired: 30,
        route: '/games/count',
        color: '#d97706',
    },
    {
        id: 'animalfood',
        title: 'Tier-Essen',
        emoji: '🍽️',
        description: 'Was isst das Tier? Finde es heraus!',
        starsRequired: 40,
        route: '/games/animalfood',
        color: '#16a34a',
    },
    {
        id: 'simon',
        title: 'Simon sagt',
        emoji: '🎮',
        description: 'Merke die Farben-Reihe!',
        starsRequired: 50,
        route: '/games/simon',
        color: '#9333ea',
    },
    {
        id: 'wordbuild',
        title: 'Wort-Puzzle',
        emoji: '🔤',
        description: 'Baue das Wort aus den Buchstaben!',
        starsRequired: 60,
        route: '/games/wordbuild',
        color: '#0284c7',
    },
    {
        id: 'pattern',
        title: 'Muster-Zauberer',
        emoji: '🔵',
        description: 'Merke und male das Muster nach!',
        starsRequired: 70,
        route: '/games/pattern',
        color: '#0d9488',
    },
    {
        id: 'sort',
        title: 'Sortier-Spaß',
        emoji: '🗂️',
        description: 'Sortiere Tiere und Essen!',
        starsRequired: 80,
        route: '/games/sort',
        color: '#c2410c',
    },
    {
        id: 'alpha',
        title: 'ABC-Jagd',
        emoji: '🔡',
        description: 'Tippe die Buchstaben von A bis J!',
        starsRequired: 90,
        route: '/games/alpha',
        color: '#7c3aed',
    },
    {
        id: 'math',
        title: 'Mathe-Spaß',
        emoji: '➕',
        description: 'Löse die Rechenaufgabe!',
        starsRequired: 100,
        route: '/games/math',
        color: '#0369a1',
    },
    {
        id: 'speedtap',
        title: 'Blitz-Tipper',
        emoji: '⚡',
        description: 'Tippe das Emoji, bevor es verschwindet!',
        starsRequired: 120,
        route: '/games/speedtap',
        color: '#b45309',
    },
]
