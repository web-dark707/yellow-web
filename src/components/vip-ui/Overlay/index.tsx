import React, {
    forwardRef,
    PropsWithChildren,
    Ref,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { useOverFlowScroll } from '@/hooks';
import { OverlayProps, OverlayRef } from '@/types/vip-ui/overlay';

const Overlay = forwardRef(
    (props: PropsWithChildren<OverlayProps>, ref: Ref<OverlayRef>) => {
        const domRef = useRef<HTMLDivElement | null>(null);
        const [isVisible, setIsVisible] = useState(false); // 内部控制使用
        const {
            visible,
            onCancel,
            className,
            children,
            clickExternal = true,
            closeIcon,
            trigger = null,
        } = props;

        const handleCancel = () => {
            onCancel && onCancel();
            trigger && setIsVisible(false);
        };

        const handleClick = () => {
            setIsVisible(true);
        };

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
            close: handleCancel,
        }));

        useOverFlowScroll('html', visible);

        const renderContent = (visibleStatus: boolean) =>
            ReactDOM.createPortal(
                <AnimatePresence>
                    {visibleStatus && (
                        <div
                            className="fixed inset-0 z-999 flex-row-center flex-col overlay-bg"
                            ref={domRef}
                            onClick={() => clickExternal && handleCancel()}
                        >
                            <motion.div
                                initial={motionInit.scale.initial}
                                animate={motionInit.scale.animate}
                                exit={motionInit.scale.exit}
                                transition={{ duration: 0.2 }}
                                className={classNames(
                                    'relative w-full',
                                    className,
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {children}
                                <div
                                    className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2"
                                    onClick={handleCancel}
                                >
                                    {closeIcon ? (
                                        closeIcon
                                    ) : (
                                        <img
                                            className="w-[40px]"
                                            src={require('@/assets/images/vip-ui/close.png')}
                                        ></img>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.getElementById('root'),
            );

        const renderTriggerContent = () => {
            return (
                <>
                    {React.cloneElement(trigger as React.ReactElement, {
                        onClick: handleClick,
                    })}
                    {renderContent(isVisible)}
                </>
            );
        };
        //
        return trigger ? renderTriggerContent() : renderContent(visible);
    },
);

export default Overlay;
