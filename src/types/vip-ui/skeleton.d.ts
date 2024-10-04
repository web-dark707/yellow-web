export default interface SkeletonProps {
    /**
     * 为 true 时，显示占位图。反之则直接展示子组件
     */
    loading?: boolean;
    /**
     * 类名
     */
    className?: string;
    /**
     * loading后展示的元素
     */
    children?: ReactNode;
}

export interface SkeletonRef {
    /**
     * 最外层元素 DOM
     */
    dom: HTMLDivElement | null;
}
