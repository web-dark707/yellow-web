import DataCache, { _DataCache } from './dataCache';

interface _DataBroker {
    subscribers: Function[];
    cache: _DataCache;
    subscribe(fn: Function): void;
    fromPolling(data: any, idKey: string): void;
    fromWebSocket(data: any, idKey: string): void;
    processData(data: any, idKey: string): void;
    notify(data: any): void;
}

class DataBroker implements _DataBroker {
    private static instance: DataBroker;
    private constructor() {
        this.subscribers = [];
        this.cache = new DataCache();
    }
    cache: _DataCache;
    public subscribers: Function[];

    // 单例模式
    static getInstance() {
        if (!DataBroker.instance) {
            DataBroker.instance = new DataBroker();
        }
        return DataBroker.instance;
    }

    // 注册
    subscribe = (fn) => {
        this.subscribers.push(fn);
    };

    // 从轮询获取数据
    fromPolling = (data, idKey) => {
        this.processData(data, idKey);
    };

    // 从WebSocket获取数据
    fromWebSocket = (data, idKey) => {
        this.processData(data, idKey);
    };

    // 去重
    processData = (data, idKey) => {
        const key = data[idKey];
        const isOnly = this.cache.addData(key);
        if (isOnly) {
            this.notify(data);
        }
    };

    // 通知
    notify = (data) => {
        this.subscribers?.forEach((fn) => {
            fn(data);
        });
    };
}

export default DataBroker;
export const dataBroker = DataBroker.getInstance();
