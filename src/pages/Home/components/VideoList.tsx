import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { getVideoList } from '@/api/home';
import { PageParams } from '@/types/common/global';
import { selectorSearchState } from '@/store/config/selectors';
import Skeleton from '@/components/vip-ui/Skeleton';
import { Empty } from '@/components/vip-ui';
import { useUpdateEffect } from '@/hooks';
import { VideoListItem } from '@/types/api/home';
import VideoPlayerItem from './VideoPlayerItem';

interface VideoListProps {
    videoList: VideoListItem[];
}
const VideoList = () => {
    const [videoList, setVideoList] = useState<VideoListItem[]>([]);
    const searchState = useRecoilValue(selectorSearchState);
    const [pageInfo, setPageInfo] = useState<PageParams>({
        pageNum: 1,
        pageSize: 10,
    });
    const {
        mutateAsync: mutateGetVideoList,
        data,
        isLoading,
    } = useMutation(getVideoList, {
        onSuccess(res) {
            console.log(res);
            setVideoList((prev) => [...prev, ...res.data.records]);
        },
    });

    const getVideoListAsync = useCallback(() => {
        mutateGetVideoList({
            ...pageInfo,
            name: searchState,
        });
    }, [mutateGetVideoList, pageInfo, searchState]);

    const handleMore = () => {
        setPageInfo((prev) => ({
            ...prev,
            pageNum: pageInfo.pageNum + 1,
        }));
    };

    const reset = () => {
        setPageInfo({ pageNum: 1, pageSize: 10 });
        setVideoList([]);
    };

    // 查询名字时重置数据
    useUpdateEffect(() => {
        if (searchState) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchState]);

    // 初始化
    useEffect(() => {
        getVideoListAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageInfo]);

    return (
        <div className="pb-[24px]">
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                热门视频
            </div>
            <div className="flex justify-between flex-wrap mx-[12px]">
                {videoList.length === 0 && isLoading
                    ? [1, 2, 3, 4].map((_, index) => (
                          <Skeleton
                              key={index}
                              className="w-[168px] h-[100px] mb-[12px]"
                          />
                      ))
                    : videoList.map((item, i) => (
                          <VideoPlayerItem key={i} videoItem={item} />
                      ))}
                {/* 无数据 */}
                {videoList.length === 0 && !isLoading ? (
                    <Empty className="mx-auto" />
                ) : (
                    <>
                        {data?.data?.total === videoList.length ? (
                            <div className="w-full flex justify-center">
                                到底啦～
                            </div>
                        ) : (
                            <div
                                onClick={handleMore}
                                className="w-full flex justify-center"
                            >
                                <span>更多</span>
                                <CaretDownIcon className="w-[18px] h-[18px]" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoList;
