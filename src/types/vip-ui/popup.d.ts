import { ReactNode } from 'react';
export interface PopupProps {
    /**
     * 是否显示
     */
    visible?: boolean;
    /**
     * 标题
     */
    title?: string;
    /**
     * 点击唤起弹窗元素
     */
    children?: ReactNode;
    /**
     * 是否隐藏顶部header
     */
    isHeaderHide?: boolean;
    /**
     * 取消按钮文案
     */
    cancelTex?: string;
    /**
     * 确认按钮文案
     */
    confirmText?: string;
    /**
     * 取消事件
     */
    onCancel?(): void;
    /**
     * 确认事件
     * @param value 当前选中的值
     */
    onConfirm?(): void;
    /**
     * 内容
     */
    content: string | ReactElement<any, string | JSXElementConstructor<any>>;
}

export interface PopupRef {
    /**
     * popup 实例
     */
    popupRef: any;
}
