export interface PageIndicatorProps {
    /**
     * 类名
     */
    className?: string;
    /**
     * 页数改变事件
     */
    onChange?: (n: number) => void;
}

export interface PageIndicatorRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}
