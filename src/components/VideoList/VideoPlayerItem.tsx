import React, { useEffect } from 'react';
import Player from 'xgplayer';
import { useNavigate } from 'react-router-dom';
import { VideoListItem } from '@/types/api/home';
import 'xgplayer/dist/index.min.css';
import { API_URL } from '@/common/constants';

interface Props {
    videoItem: VideoListItem;
}
const VideoPlayerItem = ({ videoItem }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/player?id=${videoItem.id}`);
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
            poster: API_URL + videoItem.snapshot, //封面图
            url: API_URL + videoItem.clipUrl,
        });
        // 点击播放事件
        player.on('play', () => {
            // player.pause();
        });
        player.on('error', (err) => {
            console.log(err);
        });
    }, [videoItem]);

    return (
        <div className="w-[168px] mb-[12px] relative" onClick={handleClick}>
            <div className="w-[168px] h-[120px]">
                <div className="" id={videoItem.id}></div>
            </div>
            {/* 时长 */}
            <div className="absolute bottom-[24px] right-1 rounded-lg px-2 py-1 text-xs text-nord5 bg-gray-800 bg-opacity-75">
                {videoItem.duration}
            </div>
            <div className="w-full truncate">{videoItem.name}</div>
        </div>
    );
};

export default VideoPlayerItem;