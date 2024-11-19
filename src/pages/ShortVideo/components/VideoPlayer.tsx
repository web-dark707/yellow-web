import React, { useEffect, useRef } from 'react';
import Player from 'xgplayer';
import { IMAGE_URL } from '@/common/constants';
import 'xgplayer/dist/index.min.css';
import '../index.scss';
import { ShortVideoListItem } from '@/types/api/home';

interface Props {
    details: ShortVideoListItem;
    isPlaying: boolean; // 是否播放
    preload?: boolean; // 是否预加载
}

const VideoPlayer = ({ details, isPlaying, preload = false }: Props) => {
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        if (details || preload) {
            const player = new Player({
                id: `player-${details.id}`,
                url: IMAGE_URL + details.url,
                autoplay: isPlaying, // 只有当前视频才自动播放
                muted: preload, // 预加载视频静音
                loop: true,
                poster: details.cover
                    ? IMAGE_URL + details.cover
                    : IMAGE_URL + details.snapshot,
                videoFillMode: 'fillWidth',
                width: '100%',
                height: '100%',
                ignores: ['volume', 'fullscreen', 'playbackrate'],
            });

            playerRef.current = player;

            return () => {
                player.destroy();
            };
        }
    }, [details, isPlaying, preload]);

    // 播放/暂停控制
    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.play();
            } else {
                playerRef.current.pause();
            }
        }
    }, [isPlaying]);

    return <div id={`player-${details.id}`} className="video-container"></div>;
};

export default VideoPlayer;
