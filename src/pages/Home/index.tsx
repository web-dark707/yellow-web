import React from 'react';
import { useRecoilValue } from 'recoil';
import { Cross2Icon } from '@radix-ui/react-icons';
import VideoList from '@/components/VideoList';
import { useSetSearchStateState } from '@/store/config/hooks';
import { selectorSearchState } from '@/store/config/selectors';
import AnchorList from './components/AnchorList';

const Home = () => {
    const searchState = useRecoilValue(selectorSearchState);
    const setSearchStateState = useSetSearchStateState();

    return (
        <div className="w-full">
            <AnchorList />
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                {searchState ? (
                    <div className="flex">
                        <span className="mr-[8px]">{searchState}</span>
                        <Cross2Icon onClick={() => setSearchStateState('')} />
                    </div>
                ) : (
                    <span>热门视频</span>
                )}
            </div>
            <VideoList params={{ name: searchState }} />
        </div>
    );
};

export default Home;
