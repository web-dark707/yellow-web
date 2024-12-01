import React, { useEffect, useRef, useState } from 'react';
import Player from 'xgplayer';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import { useRecoilValue } from 'recoil';
import { IMAGE_URL } from '@/common/constants';
import 'xgplayer/dist/index.min.css';
import '../index.scss';
import { ShortVideoListItem } from '@/types/api/home';
import { selectorUserDetailState } from '@/store/user/selectors';
import { handleClipboard } from '@/utils/clipboard';

interface Props {
    details: ShortVideoListItem;
    isPlaying: boolean; // 是否播放
    preload?: boolean; // 是否预加载
    nextVideo: () => void; // 切换到下一个视频的方法
}

const VideoPlayer = ({
    details,
    isPlaying,
    preload = false,
    nextVideo,
}: Props) => {
    const playerRef = useRef<Player | null>(null);
    const [liked, setLiked] = useState(false);
    const [hearts, setHearts] = useState<number[]>([]);
    const userDetailState = useRecoilValue(selectorUserDetailState);

    const handleCopy = (e) => {
        e.preventDefault();
        const currentUrl = window.location.origin;
        const url = new URL(currentUrl);
        if (userDetailState?.invitationCode) {
            url.searchParams.set('c', userDetailState.invitationCode); // 将 'c' 的值设置为用户的邀请代码
        }
        handleClipboard(url.toString(), e);
    };

    useEffect(() => {
        if (details && (preload || isPlaying)) {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            const player = new Player({
                id: `player-${details.id}`,
                url: IMAGE_URL + details.url,
                autoplay: isPlaying, // 只有当前视频才自动播放
                muted: preload, // 预加载视频静音
                loop: true,
                poster: details.cover
                    ? IMAGE_URL + details.cover
                    : IMAGE_URL + details.snapshot,
                videoFillMode: 'contain',
                width: '100%',
                height: '100%',
                ignores: ['volume', 'fullscreen', 'playbackrate'],
            });

            player.on('error', () => {
                console.error(
                    'Video playback error, moving to the next video.',
                );
                nextVideo(); // 当播放错误时，调用 nextVideo 切换到下一个视频
            });

            playerRef.current = player;

            return () => {
                player.destroy();
            };
        }
    }, [details, isPlaying, preload, nextVideo]);

    // 播放/暂停控制
    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current
                    .play()
                    .catch((err) =>
                        console.error('Error starting playback:', err),
                    );
            } else {
                playerRef.current.pause();
            }
        }
    }, [isPlaying]);

    const handleLike = () => {
        setLiked(true);
        setHearts((prev) => [...prev, Date.now()]); // 添加一个新的心动画
        setTimeout(() => setLiked(false), 1000); // 动效持续1秒钟
    };

    return (
        <div className="w-full h-full relative">
            <div id={`player-${details.id}`} className="video-container"></div>
            <div className="absolute bottom-[220px] right-[12px] text-[16px] flex flex-col items-center space-y-4">
                <div
                    onClick={handleLike}
                    className="flex flex-col items-center space-y-1 transition-transform transform hover:scale-110"
                >
                    <motion.div
                        animate={liked ? { scale: 1.3 } : {}}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 10,
                        }}
                    >
                        <HeartIcon className="w-[32px] h-[32px] text-primaryColor" />
                    </motion.div>
                </div>
                <div
                    className="flex flex-col items-center space-y-1 transition-transform transform hover:scale-110"
                    onClick={(e) => handleCopy(e)}
                >
                    <Share1Icon
                        pointerEvents="none"
                        className="w-[32px] h-[32px] text-blue-500"
                    />
                </div>
            </div>
            <AnimatePresence>
                {hearts.map((heart) => (
                    <motion.div
                        key={heart}
                        className="absolute bottom-[260px] right-[50px] text-primaryColor"
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{
                            opacity: 0,
                            y: -100 - Math.random() * 20, // 随机向上抖动
                            x: (Math.random() - 0.5) * 50, // 随机水平抖动
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        onAnimationComplete={() => {
                            setHearts((prev) =>
                                prev.filter((h) => h !== heart),
                            );
                        }}
                    >
                        <HeartIcon className="w-6 h-6" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default VideoPlayer;
