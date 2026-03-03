// Thin IndexedDB wrapper — all methods return Promises.

const DB_NAME = 'helpseeker'
const DB_VERSION = 1

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
            const db = e.target.result
            if (!db.objectStoreNames.contains('profiles')) {
                db.createObjectStore('profiles', { keyPath: 'id' })
            }
            if (!db.objectStoreNames.contains('attempts')) {
                const store = db.createObjectStore('attempts', { keyPath: 'id' })
                store.createIndex('profileId', 'profileId', { unique: false })
                store.createIndex('scenarioId', 'scenarioId', { unique: false })
            }
        }

        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror = (e) => reject(e.target.error)
    })
}

function tx(storeName, mode, fn) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, mode)
        const req = fn(transaction.objectStore(storeName))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    }))
}

export function getAllProfiles() {
    return tx('profiles', 'readonly', s => s.getAll())
}

export function saveProfile(profile) {
    return tx('profiles', 'readwrite', s => s.put(profile))
}

export function deleteProfile(id) {
    return tx('profiles', 'readwrite', s => s.delete(id))
}

export function saveAttempt(attempt) {
    return tx('attempts', 'readwrite', s => s.put(attempt))
}

export function getAttemptsForProfile(profileId) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction('attempts', 'readonly')
        const req = transaction.objectStore('attempts').index('profileId').getAll(profileId)
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    }))
}
