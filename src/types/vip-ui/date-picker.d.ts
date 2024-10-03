import { DatePickerMode } from '@/enums/componentEnum';
export interface DatePickerProps {
    /**
     * 时间值
     */
    datePickerValue?: Date | number | string;
    /**
     * datePicker 模式
     */
    mode?: DatePickerMode;
    /**
     * 时间格式 为空时返回时间戳
     */
    formatType?: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 点击唤起弹窗元素
     */
    trigger?: ReactElement;
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
     * @param time 当前选中的时间 formatType为空时 返回时间戳
     */
    onConfirm?(time: string | number): void;

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
     * 占位文本
     */
    placeholder?: string;
    /**
     * 点击唤起弹窗元素的类名
     */
    triggerClass?: string;
    /**
     * 时间范围 最小时间
     */
    minDate?: Date | number | string | Dayjs;
    /**
     * 时间范围 最大时间
     */
    maxDate?: Date | number | string | Dayjs;
}

export interface DatePickerRef {
    /**
     * datePicker 实例
     */
    datePickerRef: any;
}
