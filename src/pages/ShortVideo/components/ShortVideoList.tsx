import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getShortVideoList } from '@/api/home';
import { ShortVideoListItem } from '@/types/api/home';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';

interface Props {}

const ShortVideoList = (props: Props) => {
    const [list, setList] = useState<ShortVideoListItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isInitial, setIsInitial] = useState<boolean>(true); // 初始加载的标志
    const isAnimating = useRef(false); // 防止多次滑动触发

    const videoPlayerRefs = useRef<React.RefObject<VideoPlayerHandle>[]>([]); // 存储每个 VideoPlayer 的引用
    const { mutateAsync: mutateGetVideoList } = useMutation(getShortVideoList);

    const handleTouchStart = useRef<number>(0);
    const handleTouchEnd = useRef<number>(0);

    // 获取视频数据
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

    // 滑动事件处理逻辑
    const handleSwipe = useCallback(
        (newDirection: 'up' | 'down') => {
            if (isAnimating.current) return;
            isAnimating.current = true;

            let newIndex = currentIndex;
            if (newDirection === 'up') {
                newIndex = Math.min(currentIndex + 1, list.length - 1);
            } else if (newDirection === 'down') {
                newIndex = Math.max(currentIndex - 1, 0);
            }

            if (newIndex !== currentIndex) {
                setIsInitial(false); // 不再是初始状态
                setCurrentIndex(newIndex);
            }

            requestAnimationFrame(() => {
                setTimeout(() => {
                    isAnimating.current = false;
                }, 500); // 与动画持续时间保持一致
            });
        },
        [currentIndex, list.length],
    );

    // 自动播放当前视频
    useEffect(() => {
        videoPlayerRefs.current.forEach((playerRef, index) => {
            if (playerRef.current?.playerRef.current) {
                if (index === currentIndex) {
                    playerRef.current.playerRef.current.play().catch((err) => {
                        console.error(`Error playing video ${index}:`, err);
                    });
                } else {
                    playerRef.current.playerRef.current.pause();
                }
            }
        });
    }, [currentIndex]);

    // 监听触摸事件
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
    }, [currentIndex, handleSwipe, list]);

    const nextVideo = () => {
        if (currentIndex < list.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="short-video-list w-full h-full overflow-hidden relative">
            {list.length > 0 && (
                <div className="w-full h-full relative">
                    {list
                        .slice(currentIndex, currentIndex + 2) // 只渲染当前视频及下一个视频
                        .map((item, index) => {
                            const actualIndex = currentIndex + index;
                            const isCurrent = actualIndex === currentIndex;

                            // 动态设置动画的初始位置和目标位置
                            let initialY;
                            if (isInitial) {
                                // 初始加载时，确保第一个视频在视口内
                                initialY = isCurrent ? 0 : '100%';
                            } else {
                                // 滑动时根据方向设置
                                initialY = isCurrent ? 0 : '100%';
                            }

                            // 初始化引用
                            if (!videoPlayerRefs.current[actualIndex]) {
                                videoPlayerRefs.current[actualIndex] =
                                    React.createRef<VideoPlayerHandle>();
                            }

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{
                                        y: initialY,
                                    }}
                                    animate={{
                                        y: isCurrent ? 0 : '100%',
                                    }}
                                    transition={{
                                        type: 'tween',
                                        ease: 'easeInOut',
                                        duration: 0.5,
                                    }}
                                    className="video-item"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <VideoPlayer
                                        ref={
                                            videoPlayerRefs.current[actualIndex]
                                        }
                                        details={item}
                                        isPlaying={isCurrent}
                                        preload={
                                            actualIndex === currentIndex + 1
                                        }
                                        nextVideo={nextVideo}
                                    />
                                </motion.div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default ShortVideoList;
