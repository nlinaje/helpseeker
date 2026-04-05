import { ref, computed, onMounted, onUnmounted } from '../vue.js'

const template = /* html */`
<div class="explanation-panel card">

    <div class="expl-header">
        <h2>💡 Erklärung</h2>
        <p class="story-recap">{{ exercise.story }}</p>
    </div>

    <!-- ── ADD ──────────────────────────────────────────────── -->
    <div v-if="op === 'add'" class="anim-area">

        <!-- Source box A -->
        <div class="add-source-box">
            <div class="anim-label-sm">{{ exercise.name }} hat {{ exercise.a }} {{ exercise.template.emoji }}:</div>
            <div class="token-row">
                <span
                    v-for="i in exercise.a"
                    :key="'a' + i"
                    class="token"
                    :class="{ 'token-leaving': animStep >= i }"
                >{{ exercise.template.emoji }}</span>
            </div>
        </div>

        <!-- Source box B -->
        <div class="add-source-box">
            <div class="anim-label-sm">Dazu kommen {{ exercise.b }} {{ exercise.template.emoji }}:</div>
            <div class="token-row">
                <span
                    v-for="i in exercise.b"
                    :key="'b' + i"
                    class="token"
                    :class="{ 'token-leaving': animStep >= exercise.a + i }"
                >{{ exercise.template.emoji }}</span>
            </div>
        </div>

        <div class="anim-plus-label" style="text-align: center; margin: 8px 0;">↓ zusammen ↓</div>

        <!-- Combined box -->
        <div class="add-total-box">
            <div class="anim-label-sm">Zusammen:</div>
            <div class="token-row">
                <span
                    v-for="i in exercise.result"
                    :key="'t' + i"
                    class="token"
                    :class="{ 'anim-token-in token-new': animStep >= i }"
                    :style="animStep < i ? 'opacity:0' : ''"
                >{{ exercise.template.emoji }}</span>
            </div>
        </div>

        <div class="anim-result" :class="{ 'anim-visible': animStep >= exercise.result + 1 }">
            {{ exercise.a }} + {{ exercise.b }} = {{ exercise.result }} {{ exercise.template.emoji }}
        </div>
    </div>

    <!-- ── SUBTRACT ──────────────────────────────────────────── -->
    <div v-else-if="op === 'subtract'" class="anim-area">
        <div class="anim-label-sm">{{ exercise.name }} hat {{ exercise.a }} {{ exercise.template.emoji }}:</div>
        <div class="token-row">
            <span
                v-for="i in exercise.a"
                :key="i"
                class="token"
                :class="{ 'token-crossed': isCrossed(i) }"
            >{{ exercise.template.emoji }}</span>
        </div>

        <div v-if="animStep >= 1" class="anim-label-sm" style="margin-top: 8px;">
            {{ exercise.b }} werden weggegeben…
        </div>

        <div class="anim-result" :class="{ 'anim-visible': animStep >= exercise.b + 1 }">
            {{ exercise.a }} − {{ exercise.b }} = {{ exercise.result }} bleiben übrig {{ exercise.template.emoji }}
        </div>
    </div>

    <!-- ── MULTIPLY ──────────────────────────────────────────── -->
    <div v-else-if="op === 'multiply'" class="anim-area">
        <div class="anim-label-sm">{{ exercise.a }} Gruppen mit je {{ exercise.b }} {{ exercise.template.emoji }}:</div>

        <div
            v-for="row in exercise.a"
            :key="row"
            class="multiply-row"
            :class="{ 'row-visible': animStep >= row }"
        >
            <span v-for="col in exercise.b" :key="col" class="token">{{ exercise.template.emoji }}</span>
            <span class="row-label">Gruppe {{ row }}</span>
        </div>

        <div class="anim-result" :class="{ 'anim-visible': animStep >= exercise.a + 1 }">
            {{ exercise.a }} × {{ exercise.b }} = {{ exercise.result }} {{ exercise.template.emoji }}
        </div>
    </div>

    <!-- ── DIVIDE ────────────────────────────────────────────── -->
    <div v-else-if="op === 'divide'" class="anim-area">
        <div class="anim-label-sm">
            Alle {{ exercise.a }} {{ exercise.template.emoji }} warten noch:
        </div>

        <!-- Pool: tokens disappear one by one as they are distributed -->
        <div class="token-row divide-pool">
            <span
                v-for="i in exercise.a"
                :key="'pool' + i"
                class="token"
                :class="{ 'token-leaving': animStep >= i }"
            >{{ exercise.template.emoji }}</span>
        </div>

        <div class="anim-plus-label" style="text-align: center; margin: 10px 0;">
            ↓ werden verteilt ↓
        </div>

        <!-- Groups: tokens arrive in round-robin order -->
        <!-- token for group g, slot s arrives at step (s-1)*b + g -->
        <div class="divide-groups">
            <div v-for="g in exercise.b" :key="g" class="divide-group">
                <div class="group-label">{{ exercise.template.groupLabel }} {{ g }}</div>
                <div class="token-row" style="justify-content: center;">
                    <span
                        v-for="slot in exercise.result"
                        :key="slot"
                        class="token"
                        :class="{ 'anim-token-in token-new': animStep >= (slot - 1) * exercise.b + g }"
                        :style="animStep < (slot - 1) * exercise.b + g ? 'opacity:0' : ''"
                    >{{ exercise.template.emoji }}</span>
                </div>
            </div>
        </div>

        <div class="anim-result" :class="{ 'anim-visible': animStep >= exercise.a + 1 }">
            {{ exercise.template.groupResultPrefix }} bekommt {{ exercise.result }} {{ exercise.template.emoji }}
        </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
        <button class="btn btn-secondary" @click="replay" aria-label="Animation nochmal abspielen">
            🔄 Nochmal ansehen
        </button>
        <button class="btn btn-primary" @click="$emit('done')" aria-label="Zur Aufgabe zurück">
            ✓ Zur Aufgabe zurück
        </button>
    </div>

</div>
`

export default {
    name: 'ExplanationView',
    template,
    props: {
        exercise: { type: Object, required: true },
    },
    emits: ['done'],
    setup(props) {
        const animStep = ref(0)
        let timer = null

        const op = computed(() => props.exercise.template.operation)

        // Total steps depends on operation
        function totalSteps() {
            const ex = props.exercise
            if (op.value === 'add')      return ex.a + ex.b + 1
            if (op.value === 'subtract') return ex.b + 1
            if (op.value === 'multiply') return ex.a + 1
            // divide: one step per token (a tokens total) + 1 for result
            return ex.a + 1
        }

        function startAnimation() {
            clearInterval(timer)
            animStep.value = 0
            const max = totalSteps()
            let step = 0
            timer = setInterval(() => {
                step++
                animStep.value = step
                if (step >= max) clearInterval(timer)
            }, 1200)
        }

        function replay() {
            startAnimation()
        }

        onMounted(startAnimation)
        onUnmounted(() => clearInterval(timer))

        // For subtract: tokens with index > result get crossed out, one by one
        function isCrossed(i) {
            // i is 1-based; tokens beyond result are the removed ones
            if (i <= props.exercise.result) return false
            const removedIndex = i - props.exercise.result  // 1-based within the removed group
            return animStep.value >= removedIndex
        }

        return { animStep, op, isCrossed, replay }
    },
}
