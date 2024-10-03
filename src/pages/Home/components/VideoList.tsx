import React from 'react';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { VideoListItem } from '@/types/api/home';

interface VideoListProps {
    videoList: VideoListItem[];
}
const VideoList = ({ videoList }: VideoListProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/player');
    };
    return (
        <div className="flex justify-between flex-wrap mx-[12px]">
            {videoList.map((item) => (
                <div
                    key={item.id}
                    className="w-[168px] mb-[12px]"
                    onClick={handleClick}
                >
                    <img className="w-full h-[120px]" src={item.cover} />
                    {/* 时长 */}
                    <div>{dayjs(item.videoSize).format('HH:mm:ss')}</div>
                    <div className="truncate">{item.videoName}</div>
                </div>
            ))}
        </div>
    );
};

export default VideoList;
