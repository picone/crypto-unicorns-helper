import { Commit } from 'vuex'

export class PriceState {
    unim = 0
    rbw = 0
}

export default {
    namespaced: true,
    state() {
        return new PriceState()
    },
    mutations: {
        setUnim(state: PriceState, unim: number) {
            state.unim = unim
        },
        setRbw(state: PriceState, rbw: number) {
            state.rbw = rbw
        },
    },
    actions: {
        async updatePrice(ctx: { commit: Commit }) {
            try {
                const urls = [
                    'https://api.coingecko.com/api/v3/simple/price?ids=unicorn-milk&vs_currencies=usd',
                    'https://api.coingecko.com/api/v3/simple/price?ids=rainbow-token-2&vs_currencies=usd',
                ]
                const resps = await Promise.all(urls.map(u => fetch(u)))
                const datas = await Promise.all(resps.map(resp => resp.json()))
                ctx.commit('setUnim', datas[0]['unicorn-milk']?.usd)
                ctx.commit('setRbw', datas[1]['rainbow-token-2']?.usd)
            } catch (e) {
                console.warn(e)
            }
        },
    },
}
