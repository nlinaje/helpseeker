// Central definition of companion character types.
// Used by views and by the template renderer.

export const CHARACTER_TYPES = {
    animal:   { emoji: '🐻', label: 'Tier',        defaultName: 'Bär'  },
    robot:    { emoji: '🤖', label: 'Roboter',     defaultName: 'Robo' },
    fantasy:  { emoji: '🧚', label: 'Fabelwesen',  defaultName: 'Fee'  },
    abstract: { emoji: '⭐', label: 'Stern',        defaultName: 'Lumi' },
}

export function characterEmoji(type) {
    return CHARACTER_TYPES[type]?.emoji ?? '🙂'
}

export function characterName(type) {
    return CHARACTER_TYPES[type]?.defaultName ?? 'Freund'
}

export function renderTemplate(text, characterType) {
    return text.replace(/\{\{character_name\}\}/g, characterName(characterType))
}
