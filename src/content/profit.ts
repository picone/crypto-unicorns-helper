import { createApp } from 'vue'
import Profit from './Profit.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from '../store'

const app = createApp(Profit)
app.use(ElementPlus)
app.use(store)
const root = document.createElement('div')
app.mount(root)
export function initProfit(elem: Element) {
    document.body.appendChild(root)
    const profitBtn = document.createElement('a')
    profitBtn.href = 'javascript:void(0);'
    profitBtn.onclick = () => {
        store.commit('showProfit')
    }
    profitBtn.setAttribute('class', 'btn btn-outline-light')
    profitBtn.setAttribute('style', 'position:absolute;bottom:20px;right:300px;')
    profitBtn.innerHTML = 'Calculator'
    elem.appendChild(profitBtn)
}
