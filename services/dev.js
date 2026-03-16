// Development utilities for testing without playing through scenarios

import * as db from './db.js'

export function isDevMode() {
    const params = new URLSearchParams(window.location.search)
    return params.get('dev') === 'true'
}

export async function createTestProfile(name = 'Test User', character = 'dog', difficulty = 'medium', stars = 150) {
    // Create profile
    const profile = {
        id: crypto.randomUUID(),
        name,
        character,
        gameDifficulty: difficulty,
        createdAt: new Date().toISOString(),
    }
    await db.saveProfile(profile)

    // Create test attempts to generate stars
    if (stars > 0) {
        const attempts = []
        let starsNeeded = stars

        while (starsNeeded > 0) {
            const starValue = Math.min(15, starsNeeded) // Max 15 stars per attempt
            const attempt = {
                id: crypto.randomUUID(),
                profileId: profile.id,
                scenarioId: `test-scenario-${attempts.length}`,
                mode: 'speech',
                score: (starValue - 5) / 10, // Convert back to 0-1 score for speech mode
                timestamp: new Date().toISOString(),
            }
            attempts.push(attempt)
            starsNeeded -= starValue
        }

        for (const attempt of attempts) {
            await db.saveAttempt(attempt)
        }
    }

    return profile
}

export async function resetAllData() {
    if (confirm('⚠️ Alle Profile und Daten werden gelöscht. Fortfahren?')) {
        const profiles = await db.getAllProfiles()
        for (const profile of profiles) {
            // Delete attempts for this profile
            const attempts = await db.getAttemptsForProfile(profile.id)
            for (const attempt of attempts) {
                await db.deleteAttempt(attempt.id)
            }
            // Delete profile
            await db.deleteProfile(profile.id)
        }
        alert('✓ Alle Daten gelöscht. Seite wird neu geladen.')
        window.location.reload()
    }
}

export function clearServiceWorkerCache() {
    if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(names => {
            Promise.all(names.map(name => caches.delete(name)))
                .then(() => {
                    alert('✓ Cache geleert. Bitte Seite neu laden (Ctrl+F5).')
                    window.location.reload()
                })
        })
    } else {
        alert('Service Worker oder Cache-API nicht verfügbar.')
    }
}

export function bumpServiceWorkerVersion() {
    alert('ℹ️ Starte die Service-Worker-Datei und ändere CACHE_NAME.\nBeispiel: CACHE_NAME = \'helpseeker-v7\' (statt v6)')
}
