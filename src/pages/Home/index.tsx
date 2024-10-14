import React from 'react';
import { useRecoilValue } from 'recoil';
import { Cross2Icon } from '@radix-ui/react-icons';
import VideoList from '@/components/VideoList';
import { useSetSearchStateState } from '@/store/config/hooks';
import { formatLabel } from '@/common/format';
import {
    selectorSearchState,
    selectorVideoCategoryState,
} from '@/store/config/selectors';
import AnchorList from './components/AnchorList';

const Home = () => {
    const setSearchStateState = useSetSearchStateState();
    const searchState = useRecoilValue(selectorSearchState);
    const videoCategoryState = useRecoilValue(selectorVideoCategoryState);

    return (
        <div className="w-full">
            <AnchorList />
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                {searchState?.name || searchState?.typeId ? (
                    <div className="flex">
                        <span className="mr-[8px]">
                            {searchState?.name ||
                                formatLabel(
                                    videoCategoryState,
                                    searchState?.typeId,
                                )}
                        </span>
                        <Cross2Icon onClick={() => setSearchStateState(null)} />
                    </div>
                ) : (
                    <span className="text-primaryColor">热门视频</span>
                )}
            </div>
            <VideoList params={searchState} />
        </div>
    );
};

export default Home;
