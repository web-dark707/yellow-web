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
    message: string;
}

//分页类型
export interface CommonList<T = any> {
    /**
     * 数据
     */
    list: T[];

    /**
     * 数量
     */
    total: number;
}

export interface PageParams {
    page?: number;
    size?: number;
    status?: number;
}

global {
    type Optional<T> = {
        [K in keyof T]?: T[K];
    };
}
