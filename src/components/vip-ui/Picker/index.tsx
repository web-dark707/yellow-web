import React, {
    useState,
    PropsWithChildren,
    Ref,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { useTranslation } from 'react-i18next';
import Picker from 'rmc-picker/es/Picker';
import 'rmc-picker/assets/popup.css';
import 'rmc-picker/assets/index.css';
import classNames from 'classnames';
import { PickerProps, PickerRef } from '@/types/vip-ui/picker';
import Popup from '../Popup';
import './index.scss';

const PickerComponent = forwardRef(
    (props: PropsWithChildren<PickerProps>, ref: Ref<PickerRef>) => {
        const { t } = useTranslation();

        const {
            title = '',
            onCancel,
            onConfirm,
            cancelTex = t('app.ui.cancel'),
            confirmText = t('app.ui.confirm'),
            items,
            trigger,
            onChange,
            placeholder,
            triggerClass,
            pickerValue,
            value,
            downIcon,
        } = props;
        const [selectedValue, setSelectedValue] = useState(
            value || pickerValue,
        );
        const [confirmValue, setConfirmValue] = useState(value || pickerValue);
        const [pickerRef, setPickerRef] = useState(null);

        useImperativeHandle(ref, () => ({
            pickerRef,
        }));

        // 选项卡改变事件
        const handleChange = (val) => {
            setSelectedValue(val);
        };
        //  取消事件
        const handleCancel = () => {
            onCancel?.();
        };
        // 确认事件
        const handleConfirm = () => {
            setConfirmValue(selectedValue);
            onChange?.(selectedValue);
            onConfirm?.(selectedValue);
        };

        const defaultTriggerDom = () => (
            <div
                className={classNames(
                    'flex-row-center rounded-[6px] py-3px',
                    triggerClass,
                )}
            >
                {confirmValue ? (
                    <div className="w-full h-full px-10px">
                        {
                            items.find((item) => item.value === confirmValue)
                                ?.label
                        }
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="border-none outline-none bg-transparent px-14px w-full h-full"
                        disabled
                    />
                )}
                {downIcon ? (
                    downIcon
                ) : (
                    <img
                        src={require('@/assets/images/icon/form/down.png')}
                        className="w-24px mr-4px"
                    />
                )}
            </div>
        );

        const pickerContent = (
            <Picker
                ref={(r) => {
                    setPickerRef(r);
                }}
                className="vip-ui-picker"
                selectedValue={selectedValue}
                onValueChange={handleChange}
            >
                {items.map((item, index) => (
                    <Picker.Item value={item.value} key={index}>
                        {item.value === null
                            ? t('record.all')
                            : item?.children
                            ? item.children
                            : item.value}
                    </Picker.Item>
                ))}
            </Picker>
        );

        return (
            <Popup
                title={title}
                content={pickerContent}
                cancelTex={cancelTex}
                confirmText={confirmText}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            >
                {trigger || defaultTriggerDom()}
            </Popup>
        );
    },
);
export default PickerComponent;
