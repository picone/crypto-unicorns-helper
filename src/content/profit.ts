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
    profitBtn.setAttribute('class', 'nav-link ms-2 my-2 btn btn-secondary')
    profitBtn.innerHTML = 'Calculator'
    elem.appendChild(profitBtn)
}
