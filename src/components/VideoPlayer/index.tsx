import React, { useEffect } from 'react';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';

const VideoPlayer = () => {
    useEffect(() => {
        const player = new Player({
            height: '100%',
            width: '100%',
            // autoplay: true,
            id: 'mse',
            poster: 'https://w.wallhaven.cc/full/2y/wallhaven-2yq73m.jpg', //封面图
            url: '//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
        });
    }, []);

    return (
        <div className="w-full h-[200px]">
            <div id="mse"></div>
        </div>
    );
};

export default VideoPlayer;
