function init() {
    const originWs = window.WebSocket
    const callWs = originWs.apply.bind(originWs)
    let wsAddListener = originWs.prototype.addEventListener
    wsAddListener = wsAddListener.call.bind(wsAddListener)
    window.WebSocket = function(url, protocols) {
        let ws = null;
        if (!(this instanceof WebSocket)) {
            ws = callWs(this, arguments)
        } else if (arguments.length == 1) {
            ws = new originWs(url)
        } else if (arguments.length == 2) {
            ws = new originWs(url, protocols)
        } else {
            ws = new originWs()
        }
        wsAddListener(ws, 'message', event => {
            onRecv(event)
        })
        return ws
    }.bind()
    window.WebSocket.prototype = originWs.prototype
    window.WebSocket.prototype.constructor = window.WebSocket
}

function onRecv(event) {
    const data = event?.data
    if (!data || !(data instanceof ArrayBuffer) || data.byteLength < 7) {
        return
    }
    const dv = new DataView(data)
    if (dv.getUint8(0) != 4) {
        return
    }
    const command = dv.getUint16(1)
    let dataOffset = 4
    if (dv.getUint8(3) == 0x80) {
        dataOffset = 6
    }
    const buf = data.slice(dataOffset, data.byteLength)
    if (command == 314 || command == 350) {
        window.dispatchEvent(new CustomEvent('CUMessage', {
            detail: {
                type: 'recv',
                command: command,
                // If use origin ArrayBuffer, the background will recive empty
                // object. If wrap with a Uint8Array, the background will
                // receive an object like `{0: 4, 1: 0, 3: 127...}`. I have no
                // idea, so I convert the buffer to base64 string.
                data: btoa(String.fromCharCode(...new Uint8Array(buf))),
            },
        }))
    }
}

init()
