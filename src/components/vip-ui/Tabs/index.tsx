import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classnames from 'classnames';
import classNames from 'classnames';
import { TabItem, TabsProps } from '@/types/vip-ui/tabs';

const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const tabsRef = useRef(null);
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
    const [acIndex, setAcIndex] = useState<number>(0);
    // 当前选中项
    const [currentItem, setCurrentItem] = useState<TabItem>();
    //激活样式
    const [indicatorStyle, setIndicatorStyle] = useState({});
    // tab激活选项的位置
    const [translateX, setTranslateX] = useState(0);
    // 选项点击事件
    const handelTabItemClick = (index: number) => {
        setAcIndex(index);
        setCurrentItem(items[index]);
        onChange?.(index, items[index].key);
        scrollToCenter(index);
    };

    const updateIndicator = (index) => {
        const tabsContainer = tabsRef.current;
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

                setTranslateX(-newTranslateX);
            }
        }
    };

    useEffect(() => {
        if (activeKey) {
            const initialIndex = activeKey
                ? items.findIndex((it) => it.key === activeKey)
                : 0;
            updateIndicator(initialIndex);
            scrollToCenter(initialIndex);
        } else {
            updateIndicator(acIndex);
            scrollToCenter(acIndex);
        }
    }, [activeKey, items, acIndex]);

    // 初始化
    useEffect(() => {
        if (activeKey) {
            const index =
                items.findIndex((it) => it.key === activeKey) !== -1
                    ? items.findIndex((it) => it.key === activeKey)
                    : 0;
            setAcIndex(index);
            setCurrentItem(items[index]);
        } else {
            setAcIndex(0);
            setCurrentItem(items[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {items.length === 0 ? null : (
                <div className="w-full">
                    <div
                        className={classnames(
                            'z-10 top-0 h-45px px-16px pt-15px mb-16px whitespace-nowrap',
                            tabsClassName,
                            isSticky && 'sticky',
                        )}
                        style={{
                            transform: `translateX(${translateX}px)`,
                            transition: 'transform 0.2s',
                        }}
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
                                                    i === acIndex
                                                        ? 'primary-text-gradient tab-text-shadow'
                                                        : 'text-[#B3B3B3]',
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                            {item?.dotNum &&
                                            Number(item.dotNum) > 0 ? (
                                                <span
                                                    className={classNames(
                                                        'px-[2px] inline-block min-w-[12px] min-h-[12px] leading-[12px] rounded-full text-[10px] absolute top-[-4px] right-[-16px] bg-error text-[#fff]',
                                                        dotClassName,
                                                    )}
                                                >
                                                    {item.dotNum}
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>
                                );
                            })}
                            {isUseActiveLine && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={indicatorStyle}
                                    className={`absolute left-0 -bottom-12px`}
                                >
                                    <div
                                        className={classNames(
                                            'bg-primaryColor w-[45%] h-2px m-auto rounded-12px',
                                        )}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                    {/* 内容区域 */}
                    <div className={classnames(contentClassName)}>
                        {isUseAnime ? (
                            <AnimatePresence>
                                <motion.div
                                    key={acIndex}
                                    initial={{ opacity: 0, y: '20vw' }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: '-20vw' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {currentItem?.children}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            currentItem?.children
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Tabs;
