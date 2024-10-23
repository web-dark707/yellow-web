export interface PageIndicatorProps {
    /**
     * 类名
     */
    className?: string;
    /**
     * 页数改变事件
     */
    onChange?: (n: number) => void;
    /**
     * 总页数
     */
    total?: number;
    /**
     * 是否重置
     */
    isReset?: boolean;
}

export interface PageIndicatorRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}
