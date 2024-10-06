import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getVideoDetails } from '@/api/home';
import { getQueryString, isEmpty } from '@/utils/tools';
import VideoPlayer from './components/VideoPlayer';

const Player = () => {
    const navigate = useNavigate();
    const id = getQueryString('id');

    const { mutateAsync: mutateGetVideoDetails } = useMutation(getVideoDetails);
    useEffect(() => {
        if (isEmpty(id)) {
            return navigate('/home');
        }
        mutateGetVideoDetails({ id });
    }, [id, mutateGetVideoDetails, navigate]);

    return (
        <div>
            <VideoPlayer />
        </div>
    );
};

export default Player;
