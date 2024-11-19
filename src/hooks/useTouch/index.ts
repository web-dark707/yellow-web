import { useEffect, useRef } from 'react';

interface Props {
    touchLeft?: () => void;
    touchRight?: () => void;
    touchTop?: () => void;
    touchBottom?: () => void;
}

export default function useTouch(props?: Props) {
    const { touchLeft, touchRight, touchTop, touchBottom } = props;

    // 使用 useRef 存储触摸数据，避免不必要的依赖项
    const touchDataRef = useRef({
        startTime: 0,
        startX: 0,
        startY: 0,
        endTime: 0,
        endX: 0,
        endY: 0,
    });

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            const touchData = touchDataRef.current;
            touchData.startTime = new Date().getTime();
            touchData.startX = e.touches[0].screenX;
            touchData.startY = e.touches[0].screenY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchData = touchDataRef.current;
            touchData.endTime = new Date().getTime();
            touchData.endX = e.changedTouches[0].screenX;
            touchData.endY = e.changedTouches[0].screenY;

            const moveTime = touchData.endTime - touchData.startTime;
            const moveDistanceX = touchData.startX - touchData.endX;
            const moveDistanceY = touchData.startY - touchData.endY;

            // 判断滑动距离超过 40 且 时间小于 500 毫秒
            if (
                (Math.abs(moveDistanceX) > 40 ||
                    Math.abs(moveDistanceY) > 40) &&
                moveTime < 500
            ) {
                // 判断 X 轴移动的距离是否大于 Y 轴移动的距离
                if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
                    // 左右
                    if (moveDistanceX > 0) {
                        touchLeft && touchLeft();
                    } else {
                        touchRight && touchRight();
                    }
                } else {
                    // 上下
                    if (moveDistanceY > 0) {
                        touchTop && touchTop();
                    } else {
                        touchBottom && touchBottom();
                    }
                }
            }
        };

        // 绑定事件
        document.body.addEventListener('touchstart', handleTouchStart);
        document.body.addEventListener('touchend', handleTouchEnd);

        // 在组件卸载时清理事件监听器
        return () => {
            document.body.removeEventListener('touchstart', handleTouchStart);
            document.body.removeEventListener('touchend', handleTouchEnd);
        };
    }, [touchLeft, touchRight, touchTop, touchBottom]); // 仅在这些回调变化时重新绑定
}
