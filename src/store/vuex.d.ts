import { Store } from 'vuex'
import type { GameState } from './modules/game'
import type { PriceState } from './modules/price'

declare module '@vue/runtime-core' {
    interface State {
        showCollectable: boolean
        showProfit: boolean
        game: GameState
        price: PriceState
    }
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
