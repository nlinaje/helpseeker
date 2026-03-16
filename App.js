import { defineComponent } from './vue.js'
import DevPanel from './components/DevPanel.js'

export default defineComponent({
    name: 'App',
    components: { DevPanel },
    template: `
        <router-view />
        <DevPanel />
    `,
})
