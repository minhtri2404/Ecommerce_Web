import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/tailwind/index.css'

import router from './routes/index.js'


const app = createApp(App)

app.use(router)
app.mount('#app')
