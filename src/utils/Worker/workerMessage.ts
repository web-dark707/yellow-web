// 创建Web Worker
const worker = new Worker(new URL('./msg.worker.ts', import.meta.url));

export const sendMessageWorker = (
    type: 'polling' | 'websocket' | 'response',
    data: any,
    idKey: string, //数据的唯一标识
) => {
    worker.postMessage({ type, data, idKey: idKey });
};

export const subscribeMessageWorker = (callback: (data: any) => void) => {
    worker.addEventListener('message', (event) => {
        const { type } = event.data;
        if (type === 'response') {
            callback(event.data.data);
        }
    });
};

export const closeMessageWorker = () => {
    worker.terminate();
};
