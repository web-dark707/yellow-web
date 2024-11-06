import React, { useEffect } from 'react';
import Player from 'xgplayer';
import { VideoDetailsItem } from '@/types/api/home';
import 'xgplayer/dist/index.min.css';
import { IMAGE_URL } from '@/common/constants';
import './index.scss';
import ForwardPlugin from './ForwardPlugin';
interface Props {
    details: VideoDetailsItem;
}
const VideoPlayer = ({ details }: Props) => {
    useEffect(() => {
        if (details) {
            const player = new Player({
                width: '100%',
                id: 'player',
                loading: true,
                fluid: true,
                videoFillMode: 'cover',
                poster: details.cover
                    ? IMAGE_URL + details.cover
                    : IMAGE_URL + details.snapshot, //封面图
                url: IMAGE_URL + details.url,
                fullscreen: {
                    // rotateFullscreen: true,
                },
                plugins: [ForwardPlugin],
                playbackRate: {
                    list: [
                        {
                            text: '0.5X',
                            rate: 0.5,
                        },
                        {
                            text: '0.75X',
                            rate: 0.75,
                        },
                        {
                            text: '1X',
                            iconText: '倍速',
                            rate: 1,
                        },
                        {
                            text: '1.25X',
                            rate: 1.25,
                        },
                        {
                            text: '1.5X',
                            rate: 1.5,
                        },
                        {
                            text: '2X',
                            rate: 2,
                        },
                    ],
                },
                commonStyle: {
                    // 播放完成部分进度条底色
                    playedColor: '#f8688f',
                    // 缓存部分进度条底色
                    cachedColor: '#f8688f',
                    // 音量颜色
                    volumeColor: '#f8688f',
                },
            });
            // 退出时销毁
            return () => {
                player.destroy();
            };
        }

        // 点击播放事件
        // player.on('play', () => {
        //     player.pause();
        // });
    }, [details]);

    return (
        <div className="play-container w-full">
            <div id="player"></div>
        </div>
    );
};

export default VideoPlayer;
