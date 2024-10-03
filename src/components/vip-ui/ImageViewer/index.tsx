import React, {
    FC,
    PropsWithChildren,
    Ref,
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { ImageViewerProps, ImageViewerRef } from '@/types/vip-ui/ImageViewer';
import { componentWrapper } from '@/utils/componentType';
import useOverFlowScroll from '@/hooks/useOverFlowScroll';
import { ImageViewerBaseProps, show } from './methods';

const ImageViewer = forwardRef(
    (props: PropsWithChildren<ImageViewerProps>, ref: Ref<ImageViewerRef>) => {
        const {
            className,
            image,
            visible,
            onCancel,
            clickExternal = true,
            children,
        } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));
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
        useOverFlowScroll('html', visible);

        return (
            <>
                {children}
                {ReactDOM.createPortal(
                    <AnimatePresence>
                        {visible && (
                            <div
                                ref={domRef}
                                className="fixed z-999 flex-row-center top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)]"
                                onClick={() => clickExternal && onCancel?.()}
                            >
                                <motion.div
                                    initial={motionInit.scale.initial}
                                    animate={motionInit.scale.animate}
                                    exit={motionInit.scale.exit}
                                    transition={{ duration: 0.2 }}
                                    className={classNames(
                                        'w-[86%] flex-col-center-start',
                                        className,
                                    )}
                                >
                                    <img src={image} />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.getElementById('root'),
                )}
            </>
        );
    },
);

export function methodsGenerator<P extends ImageViewerBaseProps>(
    Component: FC<P>,
) {
    return {
        //打开图片预览
        show: show(Component),
    };
}

export default componentWrapper(ImageViewer, methodsGenerator(ImageViewer));
