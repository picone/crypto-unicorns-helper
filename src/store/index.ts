import { createLogger, createStore } from 'vuex'
import game from './modules/game'
import price from './modules/price'

const store = createStore({
    state: {
        showCollectable: false,
        showProfit: false,
    },
    mutations: {
        showCollectable(state) {
            state.showCollectable = true
        },
        hideCollectable(state) {
            state.showCollectable = false
        },
        showProfit(state) {
            state.showProfit= true
        },
        hideProfit(state) {
            state.showProfit = false
        },
    },
    modules: {
        game,
        price,
    },
    strict: true,
    plugins: [
        createLogger(),
    ],
})

export default store
