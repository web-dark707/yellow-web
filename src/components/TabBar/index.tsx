import React, { FC, useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

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
    const [acIndex, setAcIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const tabBarList = useMemo<TabBarItem[]>(
        () => [
            {
                key: 'record',
                link: '/record',
                label: '约会记录',
                selectedIcon: require('@/assets/images/icon/tab/records1.png'),
                unselectedIcon: require('@/assets/images/icon/tab/records0.png'),
                onClick: () => {},
            },
            {
                key: 'home',
                link: '/home',
                label: '约会',
                selectedIcon: require('@/assets/images/icon/tab/dating1.png'),
                unselectedIcon: require('@/assets/images/icon/tab/dating0.png'),
                onClick: () => {},
            },
            {
                key: 'userCenter',
                link: '/userCenter',
                label: '我的',
                selectedIcon: require('@/assets/images/icon/tab/userCenter1.png'),
                unselectedIcon: require('@/assets/images/icon/tab/userCenter0.png'),
                onClick: () => {},
            },
        ],
        [],
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
        <div className="w-full h-60px pb-4px flex items-end fixed bottom-0 left-0 right-0 z-99 bg-[#C95793]">
            {tabBarList.map((item, index) => (
                <div
                    key={item.key}
                    className="h-full flex-1 flex-col-center-end transition-all relative"
                    onClick={() => handleClick(index)}
                >
                    <img
                        className="w-28px mb-4px"
                        src={
                            acIndex === index
                                ? item.selectedIcon
                                : item.unselectedIcon
                        }
                    />
                    <span
                        className={classNames(
                            acIndex === index && item.key !== 'games'
                                ? 'primary-text-gradient'
                                : 'text-[#808080] leading-1em',
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
