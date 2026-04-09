import { reactive } from './vue.js'

const STORAGE_KEY = 'tiny-tasks-progress'

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : { correct: 0, total: 0 }
    } catch {
        return { correct: 0, total: 0 }
    }
}

function persist(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export const store = reactive({
    progress: loadProgress(),

    recordAttempt(wasCorrect) {
        this.progress.total++
        if (wasCorrect) this.progress.correct++
        persist(this.progress)
    },

    resetProgress() {
        this.progress = { correct: 0, total: 0 }
        persist(this.progress)
    },
})
