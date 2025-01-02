import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { getVideoDetails } from '@/api/home';
import { getQueryString, isEmpty } from '@/utils/tools';
import VideoList from '@/components/VideoList';
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

    useEffect(() => {
        if (data?.data?.record.name) {
            document.title = data.data.record.name;
            return () => {
                document.title = 'KKPRON';
            };
        }
    }, [data?.data?.record.name]);

    return (
        <div className="w-full h-full ">
            <div className="w-full h-[60px] px-[24px] flex items-center">
                <ArrowLeftIcon
                    className="w-[32px] h-[32px]"
                    onClick={() => navigate(-1)}
                />
            </div>
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
                    <div>
                        {data?.data.record.tag && (
                            <>
                                标签:&nbsp;
                                {data?.data.record.tag
                                    .split(',')
                                    .map((text, i) => (
                                        <span
                                            className="text-[#FE608E]"
                                            key={i}
                                        >
                                            #{text}
                                        </span>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <VideoList
                    pageIndicator={false}
                    params={{
                        orderByColumn: 'play_count',
                    }}
                />
            </div>
        </div>
    );
};

export default Player;
