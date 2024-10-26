import React, { useRef, useState } from 'react';
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
    const listRef = useRef<HTMLDivElement>();
    const [isReset, setIsReset] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [list, setList] = useState<VideoListItem[]>([]);
    // const [pageInfo, setPageInfo] = useState({
    //     pageNum: 1,
    //     pageSize: 10,
    // });

    const {
        mutateAsync: mutateGetVideoList,
        isLoading,
        isError,
        data,
    } = useMutation(getVideoList);

    const handleReset = () => {
        setIsReset(true);
        setList([]);
    };

    const handleCreditList = async (page?: number) => {
        const paramsTemp = {
            pageNum: page ?? 1,
            pageSize: 10,
            ...params,
        };
        const res = await mutateGetVideoList(paramsTemp);

        if (res.code === 200) {
            if (res?.data?.records?.length) {
                setHasMore(true);
                // setPageInfo((prev) => ({
                //     ...prev,
                //     pageNum: pageInfo.pageNum + 1,
                // }));
                setList(res?.data?.records);
                document.getElementsByClassName('scroll-dom')[0].scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            } else {
                setHasMore(false);
            }
            setIsReset(false);
        }
    };

    useUpdateEffect(() => {
        if (params) {
            handleReset();
        }
    }, [params]);

    return (
        <div ref={listRef} className="h-full">
            <List
                pageIndicator
                getData={handleCreditList}
                hasMore={hasMore}
                isLoading={isLoading}
                isError={isError}
                showEmpty={list.length === 0}
                isReset={isReset}
                total={
                    data?.data?.total ? Math.ceil(data?.data?.total / 10) : 0
                }
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
        </div>
    );
};

export default VideoList;
