import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getVideoDetails } from '@/api/home';
import { getQueryString, isEmpty } from '@/utils/tools';
import VideoPlayer from './components/VideoPlayer';

const Player = () => {
    const navigate = useNavigate();
    const id = getQueryString('id');

    const { mutateAsync: mutateGetVideoDetails, data } =
        useMutation(getVideoDetails);
    useEffect(() => {
        if (isEmpty(id)) {
            return navigate('/home');
        }
        mutateGetVideoDetails({ id });
    }, [id, mutateGetVideoDetails, navigate]);

    return (
        <div className="w-full h-full pt-[38px]">
            <VideoPlayer details={data?.data.record} />
            <div className="px-[16px] pt-[24px]">
                <div className="text-[18px] font-bold">
                    {data?.data.record.name}
                </div>
                <div className="text-[18px] mt-[12px]">
                    {data?.data.record.content}
                </div>
                <div className="w-full border-t-1 border-solid border-[#0F101B] mt-[16px]">
                    <div>
                        发行日期:&nbsp;
                        {dayjs(data?.data.record.createTime).format(
                            'YYYY-MM-DD',
                        )}
                    </div>
                    <div>标签:&nbsp;{data?.data.record.tag}</div>
                </div>
            </div>
        </div>
    );
};

export default Player;
