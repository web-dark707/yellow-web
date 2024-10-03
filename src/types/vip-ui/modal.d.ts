export interface ModalProps {
    /**
     * 控制显示隐藏
     */
    visible: boolean;
    /**
     * 取消回调
     */
    onCancel: () => void;
    /**
     * 标题
     */
    title?: string;
    /**
     * 需要确认按钮
     */
    confirmBtn?: boolean;
    /**
     * 需要取消按钮
     */
    cancelBtn?: boolean;
    /**
     * 确认按钮文字内容
     */
    confirmText?: string;
    /**
     * 确认按钮样式
     */
    confirmClassName?: string;
    /**
     * 取消按钮文字内容
     */
    cancelText?: string;
    /**
     * 确认回调
     */
    onConfirm?: () => void;
    /**
     * 取消按钮样式
     */
    cancelClassName?: string;
    /**
     * 点击内容区外部关闭弹窗
     */
    clickExternal?: boolean;
    /**
     * 宽度
     */
    width?: string;
    /**
     * 类名
     */
    className?: string;
    /**
     * 按钮行类名
     */
    buttonRowClassNames?: string;
}

export interface ModalRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}
