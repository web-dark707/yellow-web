import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { TabItem, TabsProps } from '@/types/vip-ui/tabs';
const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const tabsRef = useRef(null);
    const scrollRef = useRef(null);
    const {
        tabsClassName = '',
        contentClassName = '',
        tabsItemClassName = '',
        dotClassName = '',
        onChange,
        activeKey = '',
        items,
        isSticky,
        isUseAnime = true,
        isUseActiveLine = true,
    } = props;
    const [acIndex, setAcIndex] = useState<number | undefined>();
    // 当前选中项
    const [currentItem, setCurrentItem] = useState<TabItem | undefined>();
    //激活样式
    const [indicatorStyle, setIndicatorStyle] = useState({});

    // 选项点击事件
    const handelTabItemClick = (index: number) => {
        setAcIndex(index);
        setCurrentItem(items[index]);
        onChange?.(index, items[index].key);
        scrollToCenter(index);
    };

    const updateIndicator = (index) => {
        const tabsContainer = tabsRef.current;
        if (scrollRef?.current) {
            setTimeout(() => {
                scrollRef.current.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            }, 0);
        }
        if (tabsContainer) {
            const selectedTab = tabsContainer.children[index];
            if (selectedTab) {
                // 延迟10毫秒，等待DOM更新
                setTimeout(() => {
                    const { width, left } = selectedTab.getBoundingClientRect();
                    const containerLeft =
                        tabsContainer.getBoundingClientRect().left;
                    const containerScrollLeft = tabsContainer.scrollLeft;

                    const adjustedLeft =
                        left - containerLeft + containerScrollLeft;

                    setIndicatorStyle({
                        width: width,
                        transform: `translateX(${adjustedLeft}px)`,
                    });
                }, 10);
            }
        }
    };

    const scrollToCenter = (index) => {
        const tabsContainer = tabsRef.current;
        if (tabsContainer) {
            const selectedTab = tabsContainer.children[index];
            if (selectedTab) {
                const tabLeft = selectedTab.offsetLeft;
                const tabWidth = selectedTab.offsetWidth;
                const containerWidth = tabsContainer.offsetWidth;
                const containerScrollWidth = tabsContainer.scrollWidth;

                const tabCenter = tabLeft + tabWidth / 2;
                const containerCenter = containerWidth / 2;

                let newTranslateX;

                // 如果tab的中心点在可视区域内，则不滚动,否则滚动到中心点,如果tab的中心点超过可视区域的一半，则滚动到最右边,否则滚动到最左边,保证tab在可视区域的中间.
                if (tabCenter <= containerCenter) {
                    newTranslateX = 0;
                } else if (
                    tabCenter >=
                    containerScrollWidth - containerCenter
                ) {
                    newTranslateX = containerScrollWidth - containerWidth;
                } else {
                    newTranslateX = tabCenter - containerCenter;
                }
                setTimeout(() => {
                    scrollRef.current.scrollTo({
                        top: 0,
                        left: newTranslateX,
                        behavior: 'smooth',
                    });
                }, 0);
            }
        }
    };

    useEffect(() => {
        if (activeKey) {
            const initialIndex = items.findIndex((it) => it.key === activeKey);
            updateIndicator(initialIndex);
            scrollToCenter(initialIndex);
        } else {
            updateIndicator(0);
            scrollToCenter(0);
            setAcIndex(undefined);
        }
    }, [activeKey, items, acIndex]);

    // 初始化
    useEffect(() => {
        if (activeKey) {
            const index = items.findIndex((it) => it.key === activeKey);
            setAcIndex(index);
            setCurrentItem(items[index]);
        } else {
            setAcIndex(undefined);
            setCurrentItem(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {items.length === 0 ? null : (
                <div
                    className={classNames(
                        'w-full',
                        isSticky && 'sticky z-10 -top-[1px]',
                    )}
                >
                    <div
                        ref={scrollRef}
                        draggable={false}
                        className={classNames(
                            'tab-scroll-container h-45px px-16px pt-15px mb-16px whitespace-nowrap overflow-x-scroll overflow-y-hidden border-b-1 border-[#252220] border-solid',
                            tabsClassName,
                        )}
                    >
                        <div
                            className="relative flex justify-between items-center nowrap text-14px leading-20px"
                            ref={tabsRef}
                        >
                            {items.map((item, i: number) => {
                                return (
                                    <div
                                        key={item.key}
                                        className={classNames(
                                            'text-center px-10px flex-1',
                                            tabsItemClassName,
                                        )}
                                        onClick={() => handelTabItemClick(i)}
                                    >
                                        <span className="relative">
                                            <span
                                                className={classNames(
                                                    'tab-text-shadow opacity-60 font-bold text-[16px]',
                                                    i === acIndex &&
                                                        '!opacity-100 text-[#FE608E]',
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                            {i < 4 && (
                                                <svg
                                                    className="absolute -top-[2px] -right-[13px] w-[16px] h-[16px]"
                                                    xmlSpace="preserve"
                                                    viewBox="0 0 100 100"
                                                    y="0"
                                                    x="0"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    version="1.1"
                                                    style={{
                                                        margin: 'initial',
                                                        display: 'block',
                                                        shapeRendering: 'auto',
                                                        background:
                                                            'rgba(255, 255, 255, 0)',
                                                    }}
                                                    preserveAspectRatio="xMidYMid"
                                                    width="200"
                                                    height="200"
                                                >
                                                    <g
                                                        className="ldl-scale"
                                                        style={{
                                                            transformOrigin:
                                                                '50% 50%',
                                                            transform:
                                                                'rotate(0deg) scale(0.8, 0.8)',
                                                        }}
                                                    >
                                                        <g className="ldl-ani">
                                                            <g className="ldl-layer">
                                                                <g
                                                                    className="ldl-ani"
                                                                    style={{
                                                                        opacity: 1,
                                                                        transformOrigin:
                                                                            '50px 50px',
                                                                        transform:
                                                                            'matrix3d(0.91, 0, 0, 0, 0, 0.91, 0, 0, 0, 0, 0.91, 0, 0, 0, 0, 1)',
                                                                        animation:
                                                                            '1s linear -1s infinite normal forwards running animate',
                                                                        transformBox:
                                                                            'view-box',
                                                                    }}
                                                                >
                                                                    <path
                                                                        fill="#e15b64"
                                                                        clipRule="evenodd"
                                                                        fillRule="evenodd"
                                                                        d="M24.6 79.4C21.4 74 20 67.2 21.8 61.1c1.7-5.6 5.5-10.4 9.3-14.7 4.2-4.9 8.9-9.6 11.5-15.6 3.2-7.4 2.7-16.3-1.3-23.3 2.2 2.1 5.2 3 7.9 4.3 5.7 2.7 10.5 7.5 12.8 13.4 2.3 5.9 2 12.8-1.2 18.3-3.6 6.3-11.1 10.2-12.3 17.8-.4 2.9.6 6.2 3.3 7.5.9.4 1.9.6 2.9.6 3.8-.1 7.3-2.6 9.5-5.8 3.8-5.3 3.8-10.9 2.9-17.1 1.7.4 3.6 2.8 4.7 4.1 5.2 5.9 8.9 15.4 6.5 23.2-1.6 5-5.1 9.3-9.3 12.4-8.5 6.3-20.1 8-30 4.4-6-2-11.2-5.9-14.4-11.2z"
                                                                        style={{
                                                                            strokeWidth: 1,
                                                                            fill: 'rgb(203, 39, 86)',
                                                                        }}
                                                                    ></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                            {isUseActiveLine && acIndex !== undefined && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={indicatorStyle}
                                    className={`absolute left-0 -bottom-12px`}
                                >
                                    <div
                                        className={classNames(
                                            'bg-primaryColor w-[60%] h-2px m-auto rounded-12px',
                                        )}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                    {/* 内容区域 */}
                    {currentItem?.children && (
                        <div className={classNames(contentClassName)}>
                            {isUseAnime ? (
                                <AnimatePresence>
                                    <motion.div
                                        key={acIndex}
                                        initial={{ opacity: 0, y: '20vw' }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: '-20vw' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currentItem.children}
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                currentItem.children
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Tabs;
