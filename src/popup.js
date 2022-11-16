import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
const root = document.createElement('div')
app.mount(root)
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(root)
})
