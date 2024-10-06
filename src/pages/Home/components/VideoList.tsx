import React, { useState } from 'react';
import { VideoListItem } from '@/types/api/home';
import VideoPlayerItem from './VideoPlayerItem';

interface VideoListProps {
    videoList: VideoListItem[];
}
const VideoList = ({ videoList }: VideoListProps) => {
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        size: 10,
    });
    const handleMore = () => {
        setPageInfo((prev) => ({
            ...prev,
            page: pageInfo.page + 1,
        }));
    };
    return (
        <div>
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                热门视频
            </div>
            <div className="flex justify-between flex-wrap mx-[12px]">
                {videoList.map((item) => (
                    <VideoPlayerItem key={item.id} videoItem={item} />
                ))}
                {/* <Skeleton className="w-[168px] h-[100px] mb-[12px]" />
                <Skeleton className="w-[168px] h-[100px] mb-[12px]" />
                <Skeleton className="w-[168px] h-[100px] mb-[12px]" />
                <Skeleton className="w-[168px] h-[100px] mb-[12px]" />

                <div
                    onClick={handleMore}
                    className="w-full flex justify-center"
                >
                    <span>更多</span>
                    <CaretDownIcon className="w-[18px] h-[18px]" />
                </div>

                <div className="w-full flex justify-center">到底啦～</div> */}
            </div>
        </div>
    );
};

export default VideoList;
