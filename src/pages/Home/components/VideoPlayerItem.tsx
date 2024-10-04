import React, { useEffect } from 'react';
import Player from 'xgplayer';
import { useNavigate } from 'react-router-dom';
import { VideoListItem } from '@/types/api/home';
import 'xgplayer/dist/index.min.css';
import { formatSecondsToTime } from '@/common/format';

interface Props {
    videoItem: VideoListItem;
}
const VideoPlayerItem = ({ videoItem }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/player');
    };
    useEffect(() => {
        const player = new Player({
            height: '100%',
            width: '100%',
            id: videoItem.id,
            controls: false,
            autoplay: false,
            autoplayMuted: false,
            volume: 0,
            // poster: videoItem.cover, //封面图
            // url: videoItem.videoUrl,
            poster: 'https://w.wallhaven.cc/full/2y/wallhaven-2yq73m.jpg', //封面图
            url: '//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
        });
        // 点击播放事件
        player.on('play', () => {
            // console.log('play');
            // player.pause();
        });
        player.on('error', (err) => {
            console.log(err);
        });
    }, [videoItem]);

    return (
        <div className=" mb-[12px] relative" onClick={handleClick}>
            <div className="w-[168px] h-[120px]">
                <div className="" id={videoItem.id}></div>
            </div>
            {/* 时长 */}
            <div className="absolute bottom-[24px] right-1 rounded-lg px-2 py-1 text-xs text-nord5 bg-gray-800 bg-opacity-75">
                {formatSecondsToTime(videoItem.videoSize)}
            </div>
            <div className="truncate">{videoItem.videoName}</div>
        </div>
    );
};

export default VideoPlayerItem;
