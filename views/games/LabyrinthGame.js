import { ref, computed } from '../../vue.js'
import { useRouter } from '../../vue-router.js'
import { store } from '../../store.js'

const DIFFICULTY_CONFIG = {
    easy: {
        width: 5,
        height: 5,
        maze: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ],
    },
    medium: {
        width: 7,
        height: 7,
        maze: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1],
            [1, 1, 0, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ],
    },
    hard: {
        width: 10,
        height: 10,
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
    },
}

const template = /* html */`
<div class="view labyrinth-game-view">
    <div class="container">

        <header class="view-header">
            <button class="btn-back" @click="goBack" aria-label="Zurück">← Zurück</button>
            <h1>🌀 Labyrinth-Abenteuer</h1>
            <span class="memory-moves">{{ moves }} Züge</span>
        </header>

        <div v-if="won" class="win-overlay card">
            <div class="win-emoji">🏁</div>
            <div class="win-title">Hurra!</div>
            <div class="win-detail">{{ moves }} Züge — Ziel erreicht!</div>
            <div class="win-actions">
                <button class="btn btn-primary" @click="restart">Nochmal</button>
                <button class="btn btn-secondary" @click="goBack">Zurück</button>
            </div>
        </div>

        <div class="labyrinth-container">
            <div class="labyrinth-grid" :style="{ gridTemplateColumns: \`repeat(\${mazeWidth}, 1fr)\` }">
                <div
                    v-for="(cell, idx) in flatMaze"
                    :key="idx"
                    class="labyrinth-cell"
                    :class="{
                        'cell-wall': cell === 1,
                        'cell-path': cell === 0,
                        'cell-player': playerPos === idx,
                        'cell-goal': goalPos === idx,
                    }"
                    :aria-label="cellLabel(idx)"
                >
                    <span v-if="playerPos === idx" class="cell-emoji">◎</span>
                    <span v-else-if="goalPos === idx" class="cell-emoji">★</span>
                </div>
            </div>
        </div>

        <div class="labyrinth-controls">
            <button class="dir-btn up" @click="move('up')" aria-label="Nach oben">⬆️</button>
            <div style="display: flex; gap: 8px;">
                <button class="dir-btn left" @click="move('left')" aria-label="Nach links">⬅️</button>
                <button class="dir-btn down" @click="move('down')" aria-label="Nach unten">⬇️</button>
                <button class="dir-btn right" @click="move('right')" aria-label="Nach rechts">➡️</button>
            </div>
            <button class="btn btn-secondary" @click="restart" style="margin-top: 12px;">Neu mischen</button>
        </div>

    </div>
</div>
`

export default {
    name: 'LabyrinthGame',
    template,
    setup() {
        const router = useRouter()

        if (!store.currentProfile) { router.replace('/'); return {} }

        const difficulty = router.currentRoute.value.query.difficulty || store.currentProfile?.gameDifficulty || 'medium'
        const config = DIFFICULTY_CONFIG[difficulty]
        const mazeWidth = config.width
        const mazeHeight = config.height
        const initialMaze = config.maze.map(row => [...row])

        const maze = ref(initialMaze)
        const moves = ref(0)
        const playerPos = ref(1)  // Start at (0,1) = index 1
        const goalPos = computed(() => mazeWidth * mazeHeight - 2)  // Goal at bottom-right
        const won = ref(false)

        const flatMaze = computed(() => maze.value.flat())

        function indexToPos(idx) {
            return { x: idx % mazeWidth, y: Math.floor(idx / mazeWidth) }
        }

        function posToIndex(x, y) {
            if (x < 0 || x >= mazeWidth || y < 0 || y >= mazeHeight) return -1
            return y * mazeWidth + x
        }

        function move(direction) {
            if (won.value) return
            const current = indexToPos(playerPos.value)
            let newX = current.x
            let newY = current.y

            if (direction === 'up') newY--
            else if (direction === 'down') newY++
            else if (direction === 'left') newX--
            else if (direction === 'right') newX++

            const newIdx = posToIndex(newX, newY)
            if (newIdx >= 0 && maze.value[newY][newX] === 0) {
                playerPos.value = newIdx
                moves.value++

                if (playerPos.value === goalPos.value) {
                    won.value = true
                }
            }
        }

        function restart() {
            maze.value = initialMaze.map(row => [...row])
            moves.value = 0
            playerPos.value = 1
            won.value = false
        }

        function goBack() {
            router.push('/reward')
        }

        function cellLabel(idx) {
            if (playerPos.value === idx) return 'Spieler'
            if (goalPos.value === idx) return 'Ziel'
            const pos = indexToPos(idx)
            return maze.value[pos.y][pos.x] === 1 ? 'Wand' : 'Pfad'
        }

        return { maze, moves, playerPos, goalPos, won, flatMaze, mazeWidth, move, restart, goBack, cellLabel }
    },
}
