export type ImageStatus = 'loading' | 'loaded' | 'init' | 'error';

export interface ImageViewerProps {
    /**
     * 自定义类名
     */
    className?: string;
    /**
     * 图片链接
     */
    image: string;
    /**
     * 是否显示
     */
    visible?: boolean;
    /**
     * 关闭回调
     */
    onCancel?: () => void;
    /**
     * 点击内容区外部关闭弹窗
     */
    clickExternal?: boolean;
}

export interface ImageViewerRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}
