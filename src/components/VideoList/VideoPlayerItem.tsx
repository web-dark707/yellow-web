import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoListItem } from '@/types/api/home';
import { IMAGE_URL } from '@/common/constants';
import 'xgplayer/dist/index.min.css';

interface Props {
    videoItem: VideoListItem;
}
const VideoPlayerItem = ({ videoItem }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/player?id=${videoItem.id}`);
    };

    return (
        <div
            className="w-[168px] mb-[16px] relative rounded-[12px] text-[#fff]"
            onClick={handleClick}
        >
            <div className="w-[168px] h-[120px] rounded-[4px] overflow-hidden">
                <div
                    className="w-full h-full list-image-item"
                    style={{
                        backgroundImage: `url(${
                            new URL(
                                videoItem.cover
                                    ? IMAGE_URL + videoItem.cover
                                    : IMAGE_URL + videoItem.snapshot,
                            ).href
                        })`,
                    }}
                ></div>
            </div>
            {/* 时长 */}
            <div className="absolute bottom-[65px] right-1 rounded-lg px-2 py-1 text-xs bg-gray-800 bg-opacity-75">
                {videoItem.duration}
            </div>
            <div className="w-full line-clamp-2 mt-[4px] text-[#fff]">
                {videoItem.name}
            </div>
        </div>
    );
};

export default VideoPlayerItem;
