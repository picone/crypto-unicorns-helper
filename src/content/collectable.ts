import { createApp } from 'vue'
import Collectable from './Collectable.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from '../store'

const app = createApp(Collectable)
app.use(ElementPlus)
app.use(store)
const root = document.createElement('div')
app.mount(root)
export function initCollectable(elem: Element) {
    document.body.appendChild(root)
    const collectBtn = document.createElement('a')
    collectBtn.href = 'javascript:void(0);'
    collectBtn.onclick = () => {
        store.commit('showCollectable')
    }
    collectBtn.setAttribute('class', 'nav-link ms-2 my-2 btn btn-secondary')
    collectBtn.innerHTML = 'Collectable'
    elem.appendChild(collectBtn)
}
