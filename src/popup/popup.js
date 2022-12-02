import { createApp } from 'vue'
import Popup from './popup.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(Popup)
app.use(ElementPlus)
const root = document.createElement('div')
app.mount(root)
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(root)
})
