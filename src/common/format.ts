import Big from 'big.js';
import dayjs from 'dayjs';
import { isEmpty } from '@/utils/tools';
import { isDateTime } from '@/utils/validate';
import { isString } from '@/utils/is';

/**
 * @description: 处理金额，保留4位小数不四舍五入，小数结尾不能是0;
 * @param {number} num 金额
 * @param {number} decimal 保留小数位数
 */
export function formatCurrency(
    num: number,
    decimal = 4,
    baseNumber = 1000000,
): number {
    let numText = new Big(Number(num) || 0).div(baseNumber).toString()
        ? new Big(Number(num) || 0).div(baseNumber).toString()
        : (num || 0).toString();

    const index = numText.indexOf('.');
    if (index !== -1) {
        const splitList = numText.split('.');
        numText =
            splitList[0] +
            '.' +
            splitList[1].substring(0, decimal).replace(/0+?$/, '');
    } else {
        numText = numText.substring(0);
    }
    return Number(numText);
}

/**
 * @description: 处理type类型，获取label文本;
 * @param {Array} data 数据源
 * @param {number} value 当前值
 * @param {string} name label字段名
 */
export function formatLabel<
    T extends { label: string; value: number | string },
>(data: Array<T>, value: number | string, name = 'value') {
    if (isEmpty(data)) return '';
    return data.find((item) => item[name] === value)?.label;
}

/**
 * @description: 处理type类型，获取value值;
 * @param {Array} data 数据源
 * @param {number} value 当前值
 * @param {string} name value字段名
 */
export function formatValue<T extends { label: string; value: number }>(
    data: Array<T>,
    value: string | number,
    name = 'label',
) {
    if (isEmpty(data)) return;
    return data.find((item) => item[name] === value)?.value;
}

/**
 * @description: 处理金额，提交单位分的金额;
 */
export function formatReverseCurrency(
    num: number,
    baseNumber = 1000000,
): number {
    const numText = new Big(Number(num) || 0).mul(baseNumber);
    return Number(numText);
}

/**
 * @description: 处理时间戳，转换为指定格式;
 */
export const formatTime = (
    val: number | string,
    format = 'YYYY-MM-DD HH:mm:ss',
): string => {
    if (isEmpty(val)) return '';
    if (isString(val)) {
        return isDateTime.test(val) ? dayjs(val).format(format) : '';
    }
    return dayjs.unix(val).format(format);
};

/**
 * @description 格式化金额,千位添加","
 * @param {number string} value 金额
 */
export const formatAmount = (value: number | string) => {
    if (!String(value)) return '';
    const isDot = String(value).includes('.');
    const [integer, decimals] = String(value).split('.');
    const integerRes = integer
        .split('')
        .reverse()
        .reduce((prev, next, index) => (index % 3 ? next : next + ',') + prev);
    // 输出结果
    const result = `${integerRes ?? ''}${isDot ? '.' : ''}${decimals ?? ''}`;
    return result;
};

/**
 * @description: 格式化金额,千位添加","
 * @param {number string} value 金额
 */
export const reverseFormatAmount = (value: number | string) => {
    if (!String(value)) return '';
    return String(value).replace(/,/g, '');
};

/**
 * @description: 金额换算;
 */
export const reverseAmount = ({
    value,
    base = 100,
    type = 'divide', // divide除法，multiply乘法
}: {
    value: number | string;
    base?: number;
    type?: 'divide' | 'multiply';
}) => {
    if (isEmpty(value)) return 0;
    if (type === 'divide') {
        return new Big(value).div(base).toNumber();
    } else {
        return new Big(value).times(base).toNumber();
    }
};
