export interface CodeInputProps {
    /**
     * 表单里的key
     */
    field?: string;
    /**
     * 自定义类名
     */
    className?: string;
    /**
     * 输入框数量
     */
    length?: number;
    /**
     * 自动完成
     */
    autoComplete?: 'on' | 'off';
    /**
     * 单个盒子样式
     */
    boxClassName?: string;
    /**
     * 单个输入框样式
     */
    inputClassName?: string;
    /**
     * 占位文本
     */
    placeholder?: string;
    /**
     * 完成时的会回调
     */
    onFinish?: (value: any) => any;
    /**
     * 改变时回调
     */
    onChange?: (value: string) => void;
    /**
     * 正则验证，不符合验证的不允许输入
     */
    validator?: RegExp | ((value: string) => boolean);
}

export interface CodeInputRef {
    /**
     * input Ref
     */
    dom: HTMLDivElement | null;
}
