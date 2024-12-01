import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getShortVideoList } from '@/api/home';
import { ShortVideoListItem } from '@/types/api/home';
import VideoPlayer from './VideoPlayer';

interface Props {}

const ShortVideoList = (props: Props) => {
    const [list, setList] = useState<ShortVideoListItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const isAnimating = useRef(false); // 防止多次滑动触发

    const { mutateAsync: mutateGetVideoList } = useMutation(getShortVideoList);

    const handleTouchStart = useRef<number>(0);
    const handleTouchEnd = useRef<number>(0);

    const handleGetData = useCallback(async () => {
        const paramsTemp = {
            pageNum: 1,
            pageSize: 10000, // 加载所有视频
        };
        const res = await mutateGetVideoList(paramsTemp);
        if (res.code === 200) {
            const tempArr = res?.data?.records.sort(() => Math.random() - 0.5);
            setList(tempArr);
        }
    }, [mutateGetVideoList]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    const handleSwipe = (direction: 'up' | 'down') => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        let newIndex = currentIndex;
        if (direction === 'up') {
            newIndex = Math.min(currentIndex + 1, list.length - 1);
        } else if (direction === 'down') {
            newIndex = Math.max(currentIndex - 1, 0);
        }

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }

        setTimeout(() => {
            isAnimating.current = false;
        }, 300);
    };

    useEffect(() => {
        const container = document.querySelector('.short-video-list');

        if (container) {
            const onTouchStart = (e: TouchEvent) => {
                handleTouchStart.current = e.touches[0].clientY;
            };

            const onTouchEnd = (e: TouchEvent) => {
                handleTouchEnd.current = e.changedTouches[0].clientY;
                const delta = handleTouchStart.current - handleTouchEnd.current;

                if (Math.abs(delta) > 50) {
                    handleSwipe(delta > 0 ? 'up' : 'down');
                }
            };

            container.addEventListener('touchstart', onTouchStart);
            container.addEventListener('touchend', onTouchEnd);

            return () => {
                container.removeEventListener('touchstart', onTouchStart);
                container.removeEventListener('touchend', onTouchEnd);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, list]);

    const nextVideo = () => {
        if (currentIndex < list.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="short-video-list w-full h-full overflow-hidden relative">
            {list.length > 0 && (
                <div
                    className="videos-container w-full h-full transition-transform duration-300"
                    style={{
                        transform: `translateY(-${currentIndex * 100}%)`,
                    }}
                >
                    {list.map((item, index) => (
                        <div key={item.id} className="video-item">
                            <VideoPlayer
                                details={item}
                                isPlaying={index === currentIndex}
                                preload={index === currentIndex + 1} // 预加载下一个视频
                                nextVideo={nextVideo}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShortVideoList;
