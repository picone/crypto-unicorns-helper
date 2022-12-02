import store from '../store'
import { initCollectable } from './collectable.ts'
import { initProfit } from './profit.ts'

let hasInit = false

function init() {
    inject_ws()
    store.dispatch('price/updatePrice')
}

function inject_ws() {
    const originWs = window.WebSocket
    const callWs = originWs.apply.bind(originWs)
    let wsAddListener = originWs.prototype.addEventListener
    wsAddListener = wsAddListener.call.bind(wsAddListener)
    window.WebSocket = function(url, protocols) {
        let ws = null;
        if (!(this instanceof WebSocket)) {
            ws = new callWs(this, arguments)
        } else if (arguments.length == 1) {
            ws = new originWs(url)
        } else if (arguments.length == 2) {
            ws = new originWs(url, protocols)
        } else {
            ws = new originWs()
        }
        wsAddListener(ws, 'open', () => {
            try{
                onOpen()
            } catch(e) {
                console.warn(e)
            }
        })
        wsAddListener(ws, 'message', event => {
            try{
                onRecv(event)
            } catch(e) {
                console.warn(e)
            }
        })
        return ws
    }.bind()
    window.WebSocket.prototype = originWs.prototype
    window.WebSocket.prototype.constructor = window.WebSocket
}

function onOpen() {
    const allElem = document.getElementById('root')?.firstChild 
    if (!allElem || hasInit) {
        return
    }
    hasInit = true
    initCollectable(allElem)
    initProfit(allElem)
}

function onRecv(event) {
    const data = event?.data
    store.dispatch('game/parseFromWsData', data)
}

window.onload = () => {
    onOpen()
}

init()
