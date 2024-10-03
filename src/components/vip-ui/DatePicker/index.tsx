import React, {
    Ref,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import RmcDatePicker from 'rmc-date-picker';
import classNames from 'classnames';
import 'rmc-date-picker/assets/index.css';
import dayjs from 'dayjs';
import { DatePickerProps, DatePickerRef } from '@/types/vip-ui/date-picker';
import { DatePickerMode } from '@/enums/componentEnum';
import './index.scss';
import Popup from '../Popup';

const DatePicker = forwardRef(
    (props: DatePickerProps, ref: Ref<DatePickerRef>) => {
        const { t } = useTranslation();
        const {
            mode = DatePickerMode.DATE,
            title = '',
            onCancel,
            onConfirm,
            datePickerValue,
            cancelTex = t('app.ui.cancel'),
            confirmText = t('app.ui.confirm'),
            trigger,
            triggerClass,
            onChange,
            value,
            formatType,
            placeholder,
            minDate,
            maxDate,
        } = props;
        const [currentDate, setCurrentDate] = useState(
            dayjs(value || datePickerValue).toDate(),
        );
        const [confirmValue, setConfirmValue] = useState(
            dayjs(value || datePickerValue).toDate(),
        );
        const [datePickerRef, setDatePickerRef] = useState(null);
        useImperativeHandle(ref, () => ({
            datePickerRef,
        }));
        // 选项卡改变事件
        const handleChange = (value) => {
            setCurrentDate(value);
        };
        //  取消事件
        const handleCancel = () => {
            onCancel?.();
        };
        // 确认事件
        const handleConfirm = () => {
            onConfirm?.(handleFormat(currentDate));
            setConfirmValue(currentDate);
            onChange?.(handleFormat(currentDate));
        };

        const handleFormat = useCallback(
            (value: Date | number | string) => {
                if (formatType) {
                    return dayjs(value).format(formatType);
                }
                return dayjs(value).unix();
            },
            [formatType],
        );
        const switchType = (value: string | number | Date) => {
            switch (mode) {
                case DatePickerMode.DATE:
                    return dayjs(value).format('YYYY-MM-DD');
                case DatePickerMode.DATETIME:
                    return dayjs(value).format('YYYY-MM-DD HH:mm');
                case DatePickerMode.MONTH:
                    return dayjs(value).format('YYYY-MM');
                case DatePickerMode.TIME:
                    return dayjs(value).format('HH:MM');
                case DatePickerMode.YEAR:
                    return dayjs(value).format('YYYY');
                default:
                    return dayjs(value).format('YYYY-MM-DD');
            }
        };

        const defaultTriggerDom = () => (
            <div
                className={classNames(
                    'bg-[#F7EBC9] flex-row-center rounded-[6px] py-3px',
                    triggerClass,
                )}
            >
                {confirmValue ? (
                    <div className="w-full h-full px-10px">
                        {switchType(confirmValue)}
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="h-20px border-none outline-none bg-transparent px-14px w-full h-full"
                        disabled
                    />
                )}
                <img
                    src={require('@/assets/images/icon/form/date.png')}
                    className="w-24px h-24px mr-4px"
                />
            </div>
        );
        useEffect(() => {
            handleConfirm();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <Popup
                title={title}
                cancelTex={cancelTex}
                confirmText={confirmText}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                content={
                    <RmcDatePicker
                        className="vip-date-picker"
                        ref={(r) => setDatePickerRef(r)}
                        mode={mode}
                        date={currentDate}
                        minDate={minDate ? dayjs(minDate).toDate() : undefined}
                        maxDate={maxDate ? dayjs(maxDate).toDate() : undefined}
                        onDateChange={(value) => handleChange(value)}
                    />
                }
            >
                {trigger || defaultTriggerDom()}
            </Popup>
        );
    },
);

export default DatePicker;
