import { TASKS } from '../data/tasks.js';

export default {
    name: 'TaskView',
    props: ['id'],
    template: `
        <div class="task-container" style="max-width: 800px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; padding: 20px; color: white;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                <button @click="$router.push('/')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">
                    ⬅️ Zurück
                </button>
                <h1 style="margin: 0; font-size: 2rem;">{{ task ? task.emoji + ' ' + task.title : 'Laden...' }}</h1>
                <div style="width: 80px;"></div> <!-- spacer -->
            </div>

            <!-- Task Content -->
            <div v-if="task" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                
                <!-- Progress Dots -->
                <div style="display: flex; gap: 10px; margin-bottom: 2rem;">
                    <div v-for="(step, index) in task.steps" :key="index" 
                         :style="{
                             width: '15px', height: '15px', borderRadius: '50%',
                             background: index === currentStepIndex ? '#10b981' : (index < currentStepIndex ? '#3b82f6' : 'rgba(255,255,255,0.3)'),
                             transition: 'background 0.3s'
                         }">
                    </div>
                </div>

                <!-- Main Animation Area -->
                <div style="background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 500px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); min-height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                    
                    <h2 style="color: #333; font-size: 1.8rem; margin-bottom: 30px;">
                        Schritt {{ currentStepIndex + 1 }}
                    </h2>
                    
                    <p style="color: #555; font-size: 1.4rem; font-weight: bold; margin-bottom: 30px; min-height: 3em;">
                        {{ currentStep.instruction }}
                    </p>

                    <!-- Animation Container -->
                    <div class="animation-stage" style="height: 150px; width: 100%; position: relative; display: flex; justify-content: center; align-items: center;">
                        
                        <!-- Generic Step Anim -->
                        <div v-if="currentStep.animationType !== 'custom-blow' && currentStep.animationType !== 'emoji-pinch'" 
                             :key="'anim-'+currentStepIndex" 
                             class="anim-element" 
                             style="font-size: 5rem; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                            {{ currentStep.emoji }}
                        </div>

                        <!-- Special Step: Pinch -->
                        <div v-else-if="currentStep.animationType === 'emoji-pinch'" style="position: relative; width: 100px; height: 100px;">
                            <div style="font-size: 4rem; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1;">👃</div>
                            <div style="font-size: 3rem; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); animation: pinch 2s infinite; z-index: 2;">🤏</div>
                        </div>

                        <!-- Special Step: Blow Mucus into Tissue -->
                        <div v-else-if="currentStep.animationType === 'custom-blow'" style="position: relative; width: 150px; height: 150px;">
                            <!-- Nose -->
                            <div style="font-size: 4rem; position: absolute; left: 50%; top: 10%; transform: translateX(-50%); z-index: 1;">👃</div>
                            
                            <!-- Tissue -->
                            <div style="font-size: 4rem; position: absolute; left: 50%; bottom: 10%; transform: translateX(-50%); z-index: 2;">🧻</div>
                            
                            <!-- Mucus (Schleim) going down -->
                            <div style="font-size: 2rem; position: absolute; left: 50%; transform: translateX(-50%); animation: blowMucus 2.5s infinite; z-index: 3;">💧</div>
                            
                            <!-- Exhale Air -->
                            <div style="font-size: 2rem; position: absolute; left: 30%; top: 50%; animation: blowAirLeft 2.5s infinite; opacity: 0;">💨</div>
                            <div style="font-size: 2rem; position: absolute; right: 30%; top: 50%; animation: blowAirRight 2.5s infinite; opacity: 0; transform: scaleX(-1);">💨</div>
                        </div>

                    </div>
                    
                </div>

                <!-- Navigation Controls -->
                <div style="display: flex; gap: 20px; margin-top: 3rem;">
                    <button v-if="currentStepIndex > 0" @click="prevStep" 
                            style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 15px 30px; border-radius: 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: background 0.2s;">
                        Zurück
                    </button>
                    
                    <button v-if="currentStepIndex < task.steps.length - 1" @click="nextStep" 
                            style="background: #10b981; border: none; color: white; padding: 15px 40px; border-radius: 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.2s;"
                            onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Weiter ➡️
                    </button>
                    
                    <button v-else @click="finishTask" 
                            style="background: #f59e0b; border: none; color: white; padding: 15px 40px; border-radius: 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: transform 0.2s;"
                            onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Fertig! 🎉
                    </button>
                </div>

            </div>
        </div>
    `,
    data() {
        return {
            task: null,
            currentStepIndex: 0
        }
    },
    computed: {
        currentStep() {
            return this.task ? this.task.steps[this.currentStepIndex] : null;
        }
    },
    created() {
        this.task = TASKS.find(t => t.id === this.id);
        if (!this.task) {
            this.$router.push('/');
        }
        
        // Inject custom animations if not defined
        if (!document.getElementById('task-animations')) {
            const style = document.createElement('style');
            style.id = 'task-animations';
            style.innerHTML = `
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes pinch {
                    0%, 100% { transform: translate(-30%, -30%) scale(1.2); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
                }
                @keyframes blowMucus {
                    0% { top: 30%; opacity: 0; transform: translateX(-50%) scale(0.5); }
                    20% { top: 40%; opacity: 1; transform: translateX(-50%) scale(1); }
                    60% { top: 60%; opacity: 1; transform: translateX(-50%) scale(1.2); }
                    80% { top: 75%; opacity: 0.5; transform: translateX(-50%) scale(0.8); }
                    100% { top: 75%; opacity: 0; transform: translateX(-50%) scale(0); }
                }
                @keyframes blowAirLeft {
                    0%, 20% { transform: translate(20px, -20px) scale(0.5); opacity: 0; }
                    40%, 60% { transform: translate(-10px, 10px) scale(1.2); opacity: 0.8; }
                    100% { transform: translate(-30px, 30px) scale(1.5); opacity: 0; }
                }
                @keyframes blowAirRight {
                    0%, 20% { transform: scaleX(-1) translate(20px, -20px) scale(0.5); opacity: 0; }
                    40%, 60% { transform: scaleX(-1) translate(-10px, 10px) scale(1.2); opacity: 0.8; }
                    100% { transform: scaleX(-1) translate(-30px, 30px) scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    methods: {
        nextStep() {
            if (this.currentStepIndex < this.task.steps.length - 1) {
                this.currentStepIndex++;
            }
        },
        prevStep() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
            }
        },
        finishTask() {
            // Can show a celebration modal, here we just return home for now
            alert("Gut gemacht! 🌟");
            this.$router.push('/');
        }
    }
}
