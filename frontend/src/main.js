import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/tailwind/index.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import router from './routes/index.js'


const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.use(router)
app.mount('#app')
