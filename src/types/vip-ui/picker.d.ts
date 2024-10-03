import { ReactElement, ReactNode } from 'react';

export interface PickerProps {
    /**
     * 选中值
     */
    pickerValue?: string | number;
    /**
     * 标题
     */
    title?: string;
    /**
     * 取消按钮文案
     */
    cancelTex?: string;
    /**
     * 确认按钮文案
     */
    confirmText?: string;

    /**
     * 点击唤起弹窗元素
     */
    trigger?: ReactElement;
    /**
     * 取消事件
     */
    onCancel?(): void;
    /**
     * 确认事件
     * @param value 当前选中的值
     */
    onConfirm?(value: string | number): void;

    /**
     * 表单事件
     * @param value 当前选中的值
     */
    onChange?(value: string | number): void;

    /**
     * 表单值
     */
    value?: string;

    /**
     * 选项数据
     */
    items: PickerItem[];

    /**
     * 占位文本
     */
    placeholder?: string;

    /**
     * 点击唤起弹窗元素的类名
     */
    triggerClass?: string;
    /**
     * 下拉icon
     */
    downIcon?: ReactElement;
}

interface PickerItem {
    /**
     * 选项value值
     */
    value: string | number;
    /**
     * 自定义渲染选项
     */
    children?: ReactNode;

    /**
     * 自定义渲染元素。显示选项
     */
    label?: ReactNode;
}

export interface PickerRef {
    /**
     * popup 实例
     */
    pickerRef: any;
}
