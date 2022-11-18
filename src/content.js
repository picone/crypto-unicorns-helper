// inspect window.WebSocket to get the traffic.
function injectWs() {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('inject.js')
    script.onload = () => {
        script.remove()
    }
    (document.head || document.documentElement).appendChild(script)
}

// proxy message from websocket to background worker
function messageProxy() {
    window.addEventListener('CUMessage', event => {
        if (event?.detail) {
            chrome.runtime.sendMessage(event.detail)
        }
    }, false)
}

injectWs()
messageProxy()
