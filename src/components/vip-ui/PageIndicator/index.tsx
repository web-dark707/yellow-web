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
import { usePrevious, useUpdateEffect } from '@/hooks';

const PageIndicator = forwardRef(
    (
        props: PropsWithChildren<PageIndicatorProps>,
        ref: Ref<PageIndicatorRef>,
    ) => {
        const { className, onChange, total, isReset = false } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        const [current, setCurrent] = useState<number>();
        const [numList, setNumList] = useState([]);
        const prev = usePrevious(current);
        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));
        const count = 3;

        const handlePrev = () => {
            if (current !== 1) {
                setCurrent(current - 1);
            } else return;
        };

        const handleNext = () => {
            if (current !== total) {
                setCurrent(current + 1);
            } else return;
        };
        const handleNumClick = (i) => {
            setCurrent(i);
        };
        const initNumList = () => {
            const temp = Array.from({ length: count }, (_, i) => i + 1);
            setNumList(temp);
            setCurrent(temp[0]);
        };

        useEffect(() => {
            onChange && onChange(current);
            if (current && current + 1 <= total && current - 1 > 0) {
                const temp = Array.from({ length: count }, (_, i) => {
                    if (current > prev) {
                        return i + current - 1;
                    } else if (current < prev) {
                        return i + current - 1;
                    }
                });
                setNumList(temp);
            }
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
                        'w-[32px] h-[32px] bg-primaryColor rounded-lg mr-[4px]',
                        current === numList[0] && 'opacity-55',
                    )}
                />
                {numList.map((i) => (
                    <div
                        className={classNames(
                            'h-[32px] w-[32px] leading-[32px] text-center bg-[#2F2A2A] rounded-lg mr-[4px]',
                            current === i &&
                                'border-1 border-solid border-primaryColor',
                        )}
                        key={i}
                        onClick={() => handleNumClick(i)}
                    >
                        {i}
                    </div>
                ))}
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
