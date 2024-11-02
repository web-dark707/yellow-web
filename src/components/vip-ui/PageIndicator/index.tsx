import React, {
    forwardRef,
    PropsWithChildren,
    Ref,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import {
    PageIndicatorProps,
    PageIndicatorRef,
} from '@/types/vip-ui/pageIndicator';
import { useUpdateEffect } from '@/hooks';
import { isInteger } from '@/utils/validate';
import Input from '../Input';

const PageIndicator = forwardRef(
    (
        props: PropsWithChildren<PageIndicatorProps>,
        ref: Ref<PageIndicatorRef>,
    ) => {
        const {
            className,
            onChange,
            total,
            isReset = false,
            currentValue = 1,
        } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        const [current, setCurrent] = useState<number>(currentValue);
        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        const handlePrev = () => {
            if (current !== 1) {
                setCurrent(current - 1);
            } else return;
        };
        const handleConfirm = (e: any) => {
            e.target.blur();
            if (e.target.value && e.target.value !== 0) {
                setCurrent(Number(e.target.value));
            }
        };

        const handleNext = () => {
            if (current !== total) {
                setCurrent(current + 1);
            } else return;
        };

        const initNumList = () => {
            setCurrent(1);
        };

        const handleInput = (e) => {
            if (e.target.value && e.target.value > total) {
                e.target.value = total;
                setCurrent(total);
            }
        };

        useEffect(() => {
            onChange && onChange(current);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [current]);

        useUpdateEffect(() => {
            if (isReset) {
                initNumList();
            }
        }, [isReset]);

        useEffect(() => {
            initNumList();
        }, []);

        return (
            <div className="w-full flex justify-center">
                <CaretLeftIcon
                    key="left"
                    onClick={handlePrev}
                    className={classNames(
                        'w-[32px] h-[32px] bg-primaryColor rounded-lg',
                        current === 1 && 'opacity-55',
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
                        value={String(current)}
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
                        current === total && 'opacity-55',
                    )}
                />
            </div>
        );
    },
);

export default PageIndicator;
