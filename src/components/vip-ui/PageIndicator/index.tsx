import React, {
    forwardRef,
    PropsWithChildren,
    Ref,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import {
    PageIndicatorProps,
    PageIndicatorRef,
} from '@/types/vip-ui/pageIndicator';
import { useUpdateEffect } from '@/hooks';
import { isInteger } from '@/utils/validate';
import { selectorCurrentPageState } from '@/store/config/selectors';
import { useCurrentPageState } from '@/store/config/hooks';
import Input from '../Input';

const PageIndicator = forwardRef(
    (
        props: PropsWithChildren<PageIndicatorProps>,
        ref: Ref<PageIndicatorRef>,
    ) => {
        const { className, onChange, total, isReset = false } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        const currentPage = useRecoilValue(selectorCurrentPageState);
        const setCurrentPage = useCurrentPageState();

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        const handlePrev = () => {
            if (currentPage !== 1) {
                setCurrentPage(currentPage - 1);
            } else return;
        };
        const handleConfirm = (e: any) => {
            e.target.blur();
            if (e.target.value && e.target.value !== 0) {
                setCurrentPage(Number(e.target.value));
            }
        };

        const handleNext = () => {
            if (currentPage !== total) {
                setCurrentPage(currentPage + 1);
            } else return;
        };

        const initNumList = () => {
            setCurrentPage(1);
        };

        const handleInput = (e) => {
            if (e.target.value && e.target.value > total) {
                e.target.value = total;
                setCurrentPage(total);
            }
        };

        useEffect(() => {
            onChange && onChange(currentPage);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentPage]);

        useUpdateEffect(() => {
            if (isReset) {
                initNumList();
            }
        }, [isReset]);

        return (
            <div className="w-full flex justify-center">
                <CaretLeftIcon
                    key="left"
                    onClick={handlePrev}
                    className={classNames(
                        'w-[32px] h-[32px] bg-primaryColor rounded-lg',
                        currentPage === 1 && 'opacity-55',
                    )}
                />
                <div className="h-[32px] w-[100px] px-[4px] mx-[8px] flex items-center border-1 border-solid border-primaryColor rounded-md overflow-hidden font-bold">
                    <Input
                        nativeProps={{
                            enterKeyHint: 'search',
                            autoCorrect: 'off',
                            autoCapitalize: 'off',
                            spellCheck: 'false',
                        }}
                        type="number"
                        value={String(currentPage)}
                        className="h-full"
                        inputClass="!px-0 text-center"
                        isClear={false}
                        onInput={handleInput}
                        onPressEnter={handleConfirm}
                        validator={isInteger}
                    />
                    <div className="h-full flex-row-center px-[4px] text-[#6B7280]">
                        /{total}
                    </div>
                </div>
                <CaretRightIcon
                    key="right"
                    onClick={handleNext}
                    className={classNames(
                        'w-[32px] h-[32px] bg-primaryColor rounded-lg',
                        currentPage === total && 'opacity-55',
                    )}
                />
            </div>
        );
    },
);

export default PageIndicator;
