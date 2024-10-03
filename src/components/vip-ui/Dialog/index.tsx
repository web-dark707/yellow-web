import React, { FC, Ref, forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { DialogProps, DialogRef } from '@/types/vip-ui/dialog';
import { componentWrapper } from '@/utils/componentType';
import { useOverFlowScroll } from '@/hooks';
import { DialogBaseProps, open } from './methods';
import Button from '../Button';

export * from './methods';

export const Dialog = forwardRef((props: DialogProps, ref: Ref<DialogRef>) => {
    const { t } = useTranslation();
    const {
        content,
        title,
        footer,
        renderFooter,
        className,
        close,
        visible,
        showCloseIcon = true,
    } = props;
    const domRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
        dom: domRef.current,
    }));

    const FooterButton = () => {
        return (
            <Button
                onClick={() => {
                    footer?.onClick?.();
                    close?.();
                }}
                disabled={footer?.disabled}
                className={classNames('mx-[24px] mb-[24px]', footer?.className)}
            >
                {footer?.content || t('app.ui.confirm')}
            </Button>
        );
    };

    useOverFlowScroll('html', visible);

    return (
        <div
            ref={domRef}
            className="w-full fixed z-999 flex-row-center top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.9)]"
        >
            <AnimatePresence>
                {visible && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: '-30vh' }}
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className={classNames(
                                'w-[260px] text-[#fff] rounded-[8px] card-gradient absolute left-[50%] transform -translate-x-1/2 ',
                                className,
                            )}
                        >
                            {showCloseIcon && (
                                <div
                                    className="absolute right-6px top-6px"
                                    onClick={() => {
                                        close?.();
                                    }}
                                >
                                    <img
                                        src={require('@/assets/images/icon/other/close.png')}
                                        className="w-20px"
                                    />
                                </div>
                            )}
                            {title && (
                                <div className="flex-col-center text-[16px] font-bold py-10px border-b-1 border-solid border-[#777471]">
                                    {title}
                                </div>
                            )}
                            {content && (
                                <div className="flex-row-center text-[14px] p-[24px] text-center leading-6">
                                    {content}
                                </div>
                            )}

                            {(footer || renderFooter) && (
                                <div className="w-full flex-row-center">
                                    {renderFooter?.(close) || FooterButton()}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export function methodsGenerator<P extends DialogBaseProps>(Component: FC<P>) {
    return {
        //展示常规弹窗
        open: open(Component),
    };
}

export default componentWrapper(Dialog, methodsGenerator(Dialog));
