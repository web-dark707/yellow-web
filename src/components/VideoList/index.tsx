import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { VideoListItem, VideoParams } from '@/types/api/home';
import { getVideoList } from '@/api/home';
import { useUpdateEffect } from '@/hooks';
import Skeleton from '../vip-ui/Skeleton';
import { List } from '../vip-ui';
import VideoPlayerItem from './VideoPlayerItem';
interface Props {
    params: VideoParams;
}
const VideoList = (props: Props) => {
    const { params } = props;
    const [isReset, setIsReset] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [list, setList] = useState<VideoListItem[]>([]);
    const [pageInfo, setPageInfo] = useState({
        pageNum: 1,
        pageSize: 10,
    });

    const {
        mutateAsync: mutateGetVideoList,
        isLoading,
        isError,
    } = useMutation(getVideoList);

    const handleReset = () => {
        setIsReset(true);
        setPageInfo({
            pageNum: 1,
            pageSize: 10,
        });
        setHasMore(true);
        setList([]);
    };

    const handleCreditList = async () => {
        const res = await mutateGetVideoList({
            ...pageInfo,
            ...params,
        });
        if (res.code === 200) {
            if (res?.data?.records?.length) {
                setHasMore(true);
                setPageInfo((prev) => ({
                    ...prev,
                    pageNum: pageInfo.pageNum + 1,
                }));

                setList(list.concat(res?.data?.records));
            } else {
                setHasMore(false);
            }
            setIsReset(false);
        }
    };

    useUpdateEffect(() => {
        handleReset();
    }, [params]);

    return (
        <List
            getData={handleCreditList}
            hasMore={hasMore}
            isLoading={isLoading}
            isError={isError}
            showEmpty={list.length === 0}
            isReset={isReset}
            className="mt-16px flex justify-evenly flex-wrap"
        >
            {list.length === 0 && isLoading
                ? [1, 2, 3, 4].map((_, index) => (
                      <Skeleton
                          key={index}
                          className="w-[168px] h-[100px] mb-[12px]"
                      />
                  ))
                : list.map((item, i) => (
                      <VideoPlayerItem key={i} videoItem={item} />
                  ))}
        </List>
    );
};

export default VideoList;
