import React from 'react';
import { useRecoilValue } from 'recoil';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import VideoList from '@/components/VideoList';
import { useSetSearchStateState } from '@/store/config/hooks';
import { formatLabel } from '@/common/format';
import {
    selectorSearchState,
    selectorVideoCategoryState,
} from '@/store/config/selectors';
import AnchorList from './components/AnchorList';

const Home = () => {
    const navigate = useNavigate();
    const setSearchStateState = useSetSearchStateState();
    const searchState = useRecoilValue(selectorSearchState);
    const videoCategoryState = useRecoilValue(selectorVideoCategoryState);
    const onSearch = (val: string) => {
        setSearchStateState({
            type: val,
        });
        navigate('/home');
    };
    return (
        <div className="w-full">
            <div className="w-full flex justify-between flex-wrap text-[16px] mb-[24px] mt-[12px]">
                {videoCategoryState.map((it, i) => (
                    <button
                        className="type-btn-gradient w-1/4 flex-shrink-0 text-[#fff] text-center py-[10px]"
                        key={it.value}
                        onClick={() => onSearch(it.value)}
                    >
                        {it.label}
                    </button>
                ))}
            </div>
            <AnchorList />
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                {searchState?.name ||
                    (searchState?.type && (
                        <div className="flex">
                            <span className="mr-[8px]">
                                {searchState?.name ||
                                    formatLabel(
                                        videoCategoryState,
                                        searchState?.type,
                                    )}
                            </span>
                            <Cross2Icon
                                onClick={() => setSearchStateState(null)}
                            />
                        </div>
                    ))}
            </div>
            <VideoList params={searchState} />
        </div>
    );
};

export default Home;
