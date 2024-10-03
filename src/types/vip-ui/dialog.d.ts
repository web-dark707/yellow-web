import { ReactNode } from 'react';

export type DialogType = 'alert' | 'confirm';

export interface DialogProps {
    /**
     * 弹窗标题
     */
    title?: ReactNode;

    /**
     * 按钮类名
     */
    className?: string;

    /**
     * 弹窗内容
     */
    content?: ReactNode;

    /**
     * 底部按钮配置
     */
    footer?: FooterButtonOptions;

    /**
     * 自定义渲染footer
     */
    renderFooter?: (close?: () => void) => ReactNode;

    /**
     * 关闭函数
     */
    close?: () => void;

    /**
     * 是否显示
     */
    visible?: boolean;

    /**
     * 是否显示关闭icon
     */
    showCloseIcon?: boolean;
}

export interface DialogRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}

export interface FooterButtonOptions {
    /**
     * 按钮内容
     */
    content?: ReactNode;

    /**
     * 按钮类名
     */
    className?: string;

    /**
     * 是否禁用按钮
     */
    disabled?: boolean;

    /**
     * 点击按钮事件
     */
    onClick?: () => void;
}
