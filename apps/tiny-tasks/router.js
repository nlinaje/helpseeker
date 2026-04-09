import { createRouter, createWebHashHistory } from './vue-router.js'
import HomeView     from './views/HomeView.js'
import TaskView     from './views/TaskView.js'

const routes = [
    { path: '/',         component: HomeView,     name: 'home'     },
    { path: '/task/:id', component: TaskView,     name: 'task', props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
