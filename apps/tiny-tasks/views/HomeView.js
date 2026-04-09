import { CATEGORIES, TASKS } from '../data/tasks.js';

export default {
    name: 'HomeView',
    template: `
        <div class="home-container" style="padding: 20px; max-width: 800px; margin: 0 auto; text-align: center;">
            <h1 style="color: white; font-size: 2.5rem; margin-bottom: 2rem;">Wähle eine Aufgabe</h1>
            
            <div v-for="category in categories" :key="category.id" style="margin-bottom: 30px;">
                <h2 :style="{ color: category.color }" style="font-size: 1.8rem; margin-bottom: 15px;">
                    {{ category.emoji }} {{ category.name }}
                </h2>
                
                <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                    <div v-for="task in getTasksForCategory(category.id)" :key="task.id" 
                         @click="startTask(task.id)"
                         style="background: white; border-radius: 16px; padding: 20px; width: 150px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
                         onmouseover="this.style.transform='scale(1.05)'" 
                         onmouseout="this.style.transform='scale(1)'">
                        <div style="font-size: 3rem; margin-bottom: 10px;">{{ task.emoji }}</div>
                        <div style="color: #333; font-weight: bold;">{{ task.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            categories: CATEGORIES,
            tasks: TASKS
        }
    },
    methods: {
        getTasksForCategory(categoryId) {
            return this.tasks.filter(t => t.categoryId === categoryId);
        },
        startTask(taskId) {
            this.$router.push({ name: 'task', params: { id: taskId } });
        }
    }
}
