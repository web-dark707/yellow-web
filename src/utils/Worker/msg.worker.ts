import { dataBroker } from './dataBroker';

self.addEventListener('message', function (event) {
    const { type, data, idKey } = event.data;
    //轮训和WebSocket的数据都会通过postMessage发送到Web Worker中
    if (type === 'polling') {
        dataBroker.fromPolling(data, idKey);
    } else if (type === 'websocket') {
        dataBroker.fromWebSocket(data, idKey);
    } else {
        console.error('Unknown type', type);
    }
});

dataBroker.subscribe((data) => {
    //Web Worker中的数据通过postMessage发送到主线程中
    self.postMessage({
        type: 'response',
        data,
    });
});
