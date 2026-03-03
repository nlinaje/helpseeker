import { reactive } from './vue.js'

// Singleon reactive store shared across all components via direct import.
export const store = reactive({
    // Active child profile ({ id, name, character })
    currentProfile: null,

    // Whisper model state
    modelLoaded: false,
    modelLoading: false,
    modelProgress: 0,   // 0-100

    // Result carried into CelebrationView
    lastAttempt: null,  // { scenarioId, mode, score, text }
})
