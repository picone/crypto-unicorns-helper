import type { DataStore } from '../models/game'

let dataStore = ''

function initBackground() {
    chrome.runtime.onConnect.addListener(port => {
        if (port.sender?.url?.endsWith('/events.html')) {
            port.postMessage({
                dataStore: dataStore,
            })
        }
    })
    chrome.runtime.onMessage.addListener((msg: any) => {
        if (msg) {
            dataStore = msg
            chrome.storage.local.set({
                data_store: dataStore,
            })
        }
    })
    // restore data
    chrome.storage.local.get(['data_store'], result => {
        if (result?.dataStore) {
            dataStore = result.dataStore
        }
    })
}

initBackground()
