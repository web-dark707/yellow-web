import { ReactNode } from 'react';

export interface TabsProps {
    /**
     * tabs顶部自定义类名
     */
    tabsClassName?: string;
    /**
     * 内容区自定义类名
     */
    contentClassName?: string;
    /**
     * tabItem自定义类名
     */
    tabsItemClassName?: string;
    /**
     * 当前激活 tab 面板的 key
     */
    activeKey?: string;
    /**
     * 切换面板的回调
     */
    onChange?: (index: number, key: string | number) => void;
    /**
     * TabItem配置项
     */
    items: TabItem[];
    /**
     * 是否吸顶
     */
    isSticky?: boolean;
    /**
     * 是否使用动画 默认使用
     */
    isUseAnime?: boolean;
    /**
     * 是否使用激活下划线 默认使用
     */
    isUseActiveLine?: boolean;
    /**
     * dot自定义类名
     */
    dotClassName?: string;
}

export interface TabItem {
    /**
     * 选项卡头显示文字
     */
    label: string;
    /**
     * 唯一key值
     */
    key: string | number;
    /**
     * 选项卡显示内容
     */
    children: ReactNode;
    /**
     * 右上角待办数量
     */
    dotNum?: number;
}
