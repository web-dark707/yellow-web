import React, {
    PropsWithChildren,
    useRef,
    forwardRef,
    useImperativeHandle,
    Ref,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ModalProps, ModalRef } from '@/types/vip-ui/modal';
import { useOverFlowScroll } from '@/hooks';
import { Button } from '@/components/vip-ui';

const Modal = forwardRef(
    (props: PropsWithChildren<ModalProps>, ref: Ref<ModalRef>) => {
        const domRef = useRef<HTMLDivElement | null>(null);
        const { t } = useTranslation();
        const {
            visible,
            onCancel,
            onConfirm,
            title,
            confirmBtn,
            confirmText,
            confirmClassName,
            cancelBtn,
            cancelText,
            cancelClassName,
            className,
            children,
            clickExternal = true,
            buttonRowClassNames = '',
        } = props;

        const motionInit = {
            scale: {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.8 },
            },
            x: {
                initial: { opacity: 0, x: '100vw' },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: '100vw' },
            },
        };

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        useOverFlowScroll('html', visible);

        return ReactDOM.createPortal(
            <AnimatePresence>
                {visible && (
                    <div
                        className="fixed inset-0 z-9999 flex-row-center flex-col bg-[rgba(0,0,0,0.5)]"
                        ref={domRef}
                        onClick={() => clickExternal && onCancel()}
                    >
                        <motion.div
                            initial={motionInit.scale.initial}
                            animate={motionInit.scale.animate}
                            exit={motionInit.scale.exit}
                            transition={{ duration: 0.2 }}
                            className={classNames(
                                'w-[70%] card-gradient  rounded-16px flex-col-center-start',
                                className,
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {title && (
                                <div className="w-full py-12px  flex-row-center text-16px text-[#fff] border-b  border-solid  border-[rgba(255,255,255,0.2)]">
                                    {title}
                                </div>
                            )}
                            {children}
                            <div
                                className={classNames(
                                    'w-full my-18px px-20px',
                                    buttonRowClassNames,
                                )}
                            >
                                {(cancelBtn || cancelText) && (
                                    <Button
                                        onClick={onCancel}
                                        className={classNames(
                                            'h-40px px-20px',
                                            cancelClassName,
                                        )}
                                    >
                                        {cancelText || t('app.ui.cancel')}
                                    </Button>
                                )}
                                {(confirmBtn || confirmText) && (
                                    <Button
                                        onClick={onConfirm}
                                        className={classNames(
                                            'h-40px px-20px ',
                                            confirmClassName,
                                        )}
                                    >
                                        {confirmText || t('app.ui.confirm')}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.getElementById('root'),
        );
    },
);

export default Modal;
