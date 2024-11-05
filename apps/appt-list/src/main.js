import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

import { faSquare } from '@fortawesome/free-regular-svg-icons'
// import { faSquareCheck} from '@fortawesome/free-regular-svg-icons'
import { faSquareCheck} from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faSquare, faSquareCheck, faTrashCan, faRectangleXmark)
// library.add(faSquareCheck)
// library.add(faCircle)
// library.add(faTrashCan)
// library.add(faRectangleXmark)

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
})
app.mount('#app')
