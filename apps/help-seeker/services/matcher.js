// Sørensen–Dice word-overlap fuzzy matcher.
// Proven in the pwa-test spike; extracted here as a standalone service.

const MATCH_THRESHOLD = 0.60

function normalise(s) {
    return s.toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\s]/g, '').trim()
}

export function diceScore(a, b) {
    const wordsA = normalise(a).split(/\s+/).filter(Boolean)
    const wordsB = normalise(b).split(/\s+/).filter(Boolean)
    if (wordsA.length === 0 && wordsB.length === 0) return 1
    if (wordsA.length === 0 || wordsB.length === 0) return 0
    const setA = new Set(wordsA)
    const setB = new Set(wordsB)
    let intersection = 0
    for (const w of setA) { if (setB.has(w)) intersection++ }
    return (2 * intersection) / (setA.size + setB.size)
}

export function isMatch(transcript, targetPhrase) {
    return diceScore(transcript, targetPhrase) >= MATCH_THRESHOLD
}

export { MATCH_THRESHOLD }
