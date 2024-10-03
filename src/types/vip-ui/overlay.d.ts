export interface OverlayProps {
    /**
     * 控制显示隐藏
     */
    visible?: boolean;
    /**
     * 取消回调
     */
    onCancel?: () => void;
    /**
     * 点击内容区外部关闭弹窗
     */
    clickExternal?: boolean;
    /**
     * 类名
     */
    className?: string;
    /**
     * 关闭按钮
     */
    closeIcon?: React.ReactNode;
    /**
     * 用于触发弹框打开的
     */
    trigger?: JSX.Element;
}

export interface OverlayRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
    /**
     * 关闭弹窗
     */
    close: () => void;
}
