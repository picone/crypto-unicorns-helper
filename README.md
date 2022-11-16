# Crypto Unicorns Helper

This is a helper of Chrome extensions, help you to play game eaiser.

## Feature

- Record all the buidling events, sort them and show the progresss.

More features are developing.

## How it works

1. Inject in to the game by [content.js](src/content.js)
2. Load [inject_ws.js](src/inject_ws.js) and hijack the
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket),
filter the traffic that related to building information.
3. Send the raw data to the background service.
4. [background.js](src/background.js) decode the data and update events to
global variable.
5. When you click the icon, and the popup shown, [popup.js](src/popup.js)
request the background service and get the latest building events.

## Contribute

Welcome to contribute me more UNIM, I need to breed more baby. My wallet `0xcC3b090d85AE22fcE8c1044380600a08D6105f81`

## License

[MIT](LICENSE) License
