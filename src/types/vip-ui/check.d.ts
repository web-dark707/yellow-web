export type CheckboxValue = string | number;

export interface CheckboxProps {
    checked?: boolean;
    value: CheckboxValue;
    label: ReactNode;
    onChange?: (value: CheckboxValue, bool: boolean) => void;
    /**
     * 自定义类名
     */
    className?: string;
}
