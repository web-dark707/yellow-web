import React, {
    PropsWithChildren,
    Ref,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import RmcPopup from 'rmc-picker/es/Popup';
import 'rmc-picker/assets/popup.css';
import 'rmc-picker/assets/index.css';
import { PopupProps, PopupRef } from '@/types/vip-ui/popup';
import './index.scss';

const Popup = forwardRef(
    (props: PropsWithChildren<PopupProps>, ref: Ref<PopupRef>) => {
        const { t } = useTranslation();
        const {
            title = '',
            onCancel,
            onConfirm,
            cancelTex = t('app.ui.cancel'),
            confirmText = t('app.ui.confirm'),
            isHeaderHide = false,
            visible,
            content,
            children,
        } = props;

        const [popupRef, setPopupRef] = useState(null);
        useImperativeHandle(ref, () => ({
            popupRef,
        }));

        const [visibleState, setVisibleState] = useState<boolean>(visible);
        //  取消事件
        const handleCancel = () => {
            onCancel?.();
        };
        // 确认事件
        const handleConfirm = () => {
            onConfirm?.();
        };

        const handleVisibleChange = (state) => {
            setVisibleState(state);
            !state && handleCancel();
        };
        //依赖外部控制时，更新自己的状态
        useEffect(() => {
            if ('visible' in props) {
                setVisibleState(visible);
            }
        }, [props, visible]);

        return (
            <RmcPopup
                ref={(r) => setPopupRef(r)}
                visible={visibleState}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                className={classnames(
                    'vip-ui-popup',
                    isHeaderHide && 'hide-header',
                )}
                onVisibleChange={handleVisibleChange}
                title={title}
                dismissText={cancelTex}
                okText={confirmText}
                content={content}
                onDismiss={handleCancel}
                onOk={handleConfirm}
            >
                {children}
            </RmcPopup>
        );
    },
);
export default Popup;
