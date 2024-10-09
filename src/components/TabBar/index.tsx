import React, { FC, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useSetSearchStateState } from '@/store/config/hooks';

type TabBarProps = {};

interface TabBarItem {
    key: string;
    link?: string;
    label: string;
    selectedIcon: string;
    unselectedIcon: string;
    onClick?: () => void;
}

const TabBar: FC<TabBarProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [acIndex, setAcIndex] = useState(0);
    const setSearchStateState = useSetSearchStateState();

    const tabBarList = useMemo<TabBarItem[]>(
        () => [
            {
                key: 'home',
                link: '/home',
                label: '首页',
                selectedIcon: require('@/assets/images/icon/tab/home1.png'),
                unselectedIcon: require('@/assets/images/icon/tab/home0.png'),
                onClick: () => {
                    setSearchStateState('');
                },
            },
            {
                key: 'user',
                link: '/user',
                label: '我的',
                selectedIcon: require('@/assets/images/icon/tab/user1.png'),
                unselectedIcon: require('@/assets/images/icon/tab/user0.png'),
                onClick: () => {},
            },
        ],
        [setSearchStateState],
    );
    const handleClick = (index: number) => {
        setAcIndex(index);
        const tabBarItem = tabBarList[index];
        tabBarItem.link && navigate(tabBarItem.link);
        tabBarItem?.onClick();
    };

    useEffect(() => {
        setAcIndex(tabBarList.findIndex((it) => it.link === location.pathname));
    }, [location.pathname, tabBarList]);

    return (
        <div className="w-full h-50px pb-4px flex items-end fixed bottom-0 left-0 right-0 z-99 bg-[#25252C]">
            {tabBarList.map((item, index) => (
                <div
                    key={item.key}
                    className="h-full flex-1 flex-col-center-end transition-all relative"
                    onClick={() => handleClick(index)}
                >
                    <img
                        className="w-28px"
                        src={
                            acIndex === index
                                ? item.selectedIcon
                                : item.unselectedIcon
                        }
                    />
                    <span
                        className={classNames(
                            acIndex === index
                                ? 'primary-text-gradient'
                                : 'text-[#808080]',
                        )}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TabBar;
