import { isArray, isNumber, isString } from '@/utils/is';

/**
 * @description: 处理金额，正负数转换;
 */
export const handleTradeAmount = (amount: number, type: number) => {
    // 存款正数，取款负数
    return [1, 4].includes(type) ? amount : -amount;
};

/**
 * @description: 字段为空，返回undefined
 */
export const handleCheckFormItemValue = (val: string | number | any[]): any => {
    if (isString(val)) {
        return val ? val : undefined;
    } else if (isNumber(val)) {
        return val !== 0 ? val : undefined;
    } else if (isArray(val)) {
        return val.length > 0 ? val : undefined;
    } else {
        return val ? val : undefined;
    }
};
