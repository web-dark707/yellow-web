declare type RefType<T> = T | null;

declare type Recordable<T = any> = Record<string, T>;

export interface ResponseData<T = any> {
    /**
     * 状态码
     */
    code: number;

    /**
     * 数据
     */
    data: T;

    /**
     * 消息
     */
    msg: string;
}

//分页类型
export interface CommonList<T = any> {
    /**
     * 数据
     */
    records: T[];

    /**
     * 数量
     */
    total: number;
    maxPage: number;
}

export interface PageParams {
    pageNum?: number;
    pageSize?: number;
}

global {
    type Optional<T> = {
        [K in keyof T]?: T[K];
    };
}
