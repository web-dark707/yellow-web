import React, { useEffect } from 'react';
import Player from 'xgplayer';
import { VideoDetailsItem } from '@/types/api/home';
import 'xgplayer/dist/index.min.css';
import { API_URL } from '@/common/constants';
// import './index.scss';
interface Props {
    details: VideoDetailsItem;
}
const VideoPlayer = ({ details }: Props) => {
    useEffect(() => {
        if (details) {
            console.log(details);

            const player = new Player({
                width: '100%',
                id: 'player',
                poster: details.cover
                    ? API_URL + details.cover
                    : API_URL + details.snapshot, //封面图
                url: API_URL + details.url,
            });
        }

        // 点击播放事件
        // player.on('play', () => {
        //     console.log('play');
        //     player.pause();
        // });
    }, [details]);

    return (
        <div className=" w-full">
            <div id="player"></div>
        </div>
    );
};

export default VideoPlayer;
