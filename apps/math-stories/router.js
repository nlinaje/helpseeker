import { createRouter, createWebHashHistory } from './vue-router.js'
import HomeView     from './views/HomeView.js'
import ExerciseView from './views/ExerciseView.js'

const routes = [
    { path: '/',         component: HomeView,     name: 'home'     },
    { path: '/exercise', component: ExerciseView, name: 'exercise' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
