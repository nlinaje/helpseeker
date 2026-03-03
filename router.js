import { createRouter, createWebHashHistory } from './vue-router.js'
import HomeView                from './views/HomeView.js'
import ProfileCreateView       from './views/ProfileCreateView.js'
import ScenarioListView        from './views/ScenarioListView.js'
import ScenarioPlayView        from './views/ScenarioPlayView.js'
import CelebrationView         from './views/CelebrationView.js'
import TherapistOverviewView   from './views/TherapistOverviewView.js'
import TherapistChildView      from './views/TherapistChildView.js'

const routes = [
    { path: '/',              component: HomeView,             name: 'home'       },
    { path: '/profile/new',   component: ProfileCreateView,    name: 'newProfile' },
    { path: '/scenarios',     component: ScenarioListView,     name: 'scenarios'  },
    { path: '/scenario/:id',  component: ScenarioPlayView,     name: 'play'       },
    { path: '/celebrate',     component: CelebrationView,      name: 'celebrate'  },
    { path: '/therapist',     component: TherapistOverviewView, name: 'therapist' },
    { path: '/therapist/:id', component: TherapistChildView,   name: 'therapistChild' },
    // Catch-all → home
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
