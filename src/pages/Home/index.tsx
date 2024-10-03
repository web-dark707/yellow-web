import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getVideoList } from '@/api/home';
import { VideoListItem } from '@/types/api/home';
import VideoList from './components/VideoList';

const Home = () => {
    const [videoList, setVideoList] = useState<VideoListItem[]>([]);
    const { mutateAsync: mutateGetVideoList } = useMutation(getVideoList, {
        onSuccess(res) {
            setVideoList(res.data.records);
        },
    });
    useEffect(() => {
        mutateGetVideoList();
    }, [mutateGetVideoList]);

    return (
        <div className="w-full">
            <VideoList videoList={videoList} />
        </div>
    );
};

export default Home;
