export interface _DataCache {
    queue: any[];
    cache: Set<string>;
    addData(key: string): boolean;
}

class DataCache implements _DataCache {
    constructor() {
        this.queue = [];
        this.cache = new Set();
    }
    queue: any[];
    cache: Set<string>;

    addData = (key) => {
        if (!this.cache.has(key)) {
            this.cache.add(key);
            this.queue.push(key);
            return true;
        }
        return false;
    };
}

export default DataCache;
