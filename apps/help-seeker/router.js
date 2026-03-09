import { createRouter, createWebHashHistory } from './vue-router.js'
import HomeView                from './views/HomeView.js'
import ProfileCreateView       from './views/ProfileCreateView.js'
import ScenarioListView        from './views/ScenarioListView.js'
import ScenarioPlayView        from './views/ScenarioPlayView.js'
import CelebrationView         from './views/CelebrationView.js'
import TherapistOverviewView   from './views/TherapistOverviewView.js'
import TherapistChildView      from './views/TherapistChildView.js'
import RewardView              from './views/RewardView.js'
import MemoryGame              from './views/games/MemoryGame.js'
import BubbleGame              from './views/games/BubbleGame.js'
import ColorMatchGame          from './views/games/ColorMatchGame.js'
import CountGame               from './views/games/CountGame.js'
import AnimalFoodGame          from './views/games/AnimalFoodGame.js'
import SimonSaysGame           from './views/games/SimonSaysGame.js'
import WordBuildGame           from './views/games/WordBuildGame.js'
import PatternGame             from './views/games/PatternGame.js'
import SortGame                from './views/games/SortGame.js'
import AlphaGame               from './views/games/AlphaGame.js'
import MathGame                from './views/games/MathGame.js'
import SpeedTapGame            from './views/games/SpeedTapGame.js'

const routes = [
    { path: '/',              component: HomeView,             name: 'home'           },
    { path: '/profile/new',   component: ProfileCreateView,    name: 'newProfile'     },
    { path: '/scenarios',     component: ScenarioListView,     name: 'scenarios'      },
    { path: '/scenario/:id',  component: ScenarioPlayView,     name: 'play'           },
    { path: '/celebrate',     component: CelebrationView,      name: 'celebrate'      },
    { path: '/therapist',     component: TherapistOverviewView, name: 'therapist'     },
    { path: '/therapist/:id', component: TherapistChildView,   name: 'therapistChild' },
    { path: '/reward',        component: RewardView,           name: 'reward'         },
    { path: '/games/memory',     component: MemoryGame,     name: 'memoryGame'     },
    { path: '/games/bubbles',    component: BubbleGame,     name: 'bubbleGame'     },
    { path: '/games/colormatch', component: ColorMatchGame, name: 'colorMatchGame' },
    { path: '/games/count',      component: CountGame,      name: 'countGame'      },
    { path: '/games/animalfood', component: AnimalFoodGame, name: 'animalFoodGame' },
    { path: '/games/simon',      component: SimonSaysGame,  name: 'simonGame'      },
    { path: '/games/wordbuild',  component: WordBuildGame,  name: 'wordBuildGame'  },
    { path: '/games/pattern',    component: PatternGame,    name: 'patternGame'    },
    { path: '/games/sort',       component: SortGame,       name: 'sortGame'       },
    { path: '/games/alpha',      component: AlphaGame,      name: 'alphaGame'      },
    { path: '/games/math',       component: MathGame,       name: 'mathGame'       },
    { path: '/games/speedtap',   component: SpeedTapGame,   name: 'speedTapGame'   },
    // Catch-all → home
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
