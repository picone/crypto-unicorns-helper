// inspect window.WebSocket to get the traffic.
function injectPage() {
    const elem = (document.head || document.documentElement)
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('inject.js')
    script.onload = () => {
        script.remove()
    }
    elem.appendChild(script)
    const style = document.createElement('link')
    style.href = chrome.runtime.getURL('inject.css')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    elem.appendChild(style)
}

// proxy message from websocket to background worker
function messageProxy() {
    window.addEventListener('CUMessage', event => {
        if (event?.detail) {
            chrome.runtime.sendMessage(event.detail)
        }
    }, false)
}

injectPage()
messageProxy()
