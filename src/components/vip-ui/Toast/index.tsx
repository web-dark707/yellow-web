import React, {
    useEffect,
    forwardRef,
    Ref,
    useRef,
    useImperativeHandle,
    useCallback,
    FC,
} from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { componentWrapper } from '@/utils/componentType';
import { ToastProps, ToastRef } from '@/types/vip-ui/toast';
import { useLatest } from '@/hooks';
import { ToastBaseProps, toast } from './methods';

export * from './methods';

/**
 * @description 轻提示组件，支持各个场景下调用方法。
 */
const Toast = forwardRef((props: ToastProps, ref: Ref<ToastRef>) => {
    const {
        className,
        visible = false,
        close,
        onClose,
        type = 'info',
        duration = 3000,
        content,
        automation = true,
    } = props;
    const closeTimerRef = useLatest(null);
    const domRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
        dom: domRef.current,
    }));

    const handleClose = useCallback(() => {
        close && close();
        onClose && onClose();
    }, [close, onClose]);

    const startCloseTimer = useCallback(() => {
        if (duration) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = window.setTimeout(() => {
                handleClose();
            }, duration);
        }
    }, [closeTimerRef, duration, handleClose]);

    function getTypeIcons() {
        const iconMap = {
            success: (
                <img
                    src={require('@/assets/images/vip-ui/success.svg').default}
                    className="w-[30px] mb-[4px]"
                />
            ),
            error: (
                <img
                    src={require('@/assets/images/vip-ui/error.svg').default}
                    className="w-[30px] mb-[4px]"
                />
            ),
            warn: (
                <img
                    src={require('@/assets/images/vip-ui/warn.svg').default}
                    className="w-[30px] mb-[4px]"
                />
            ),
        };
        return iconMap[type] || null;
    }

    useEffect(() => {
        if (automation) {
            startCloseTimer();
        }
    }, [automation, duration, startCloseTimer]);

    function renderComponent() {
        return (
            <div className="flex justify-start flex-col items-center  py-[8px] px-[16px] rounded-[6px] bg-[rgba(0,0,0,0.5)] max-w-[200px]">
                {getTypeIcons()}
                <div className="text-[#fff] text-[14px] text-center leading-[20px]">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div
            className={classNames(
                'top-[30vh]  left-[50%]  fixed z-9999 transform -translate-x-1/2',
                className,
            )}
            ref={domRef}
        >
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex-row-center"
                    >
                        {renderComponent()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export function methodsGenerator<P extends ToastBaseProps>(Component: FC<P>) {
    return {
        //展示常规提示框
        toast: toast(Component),
        // 展示常规提示框(无icon)
        info: toast(Component, 'info'),
        //展示成功提示框(含成功icon)
        success: toast(Component, 'success'),
        //展示错误提示框(含错误icon)
        error: toast(Component, 'error'),
        //展示警告提示框(含警告icon)
        warn: toast(Component, 'warn'),
    };
}

export default componentWrapper(Toast, methodsGenerator(Toast));
