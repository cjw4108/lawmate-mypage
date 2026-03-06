import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'chartist/dist/chartist.css'
import './assets/sass/light-bootstrap-dashboard.scss'

import LightBootstrap from './light-bootstrap-main'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(LightBootstrap)

app.mount('#app')
