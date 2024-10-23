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
import { Tabs } from '@/components/vip-ui';
import AnchorList from './components/AnchorList';

const Home = () => {
    const navigate = useNavigate();
    const setSearchStateState = useSetSearchStateState();
    const searchState = useRecoilValue(selectorSearchState);
    const videoCategoryState = useRecoilValue(selectorVideoCategoryState);
    const onSearch = (i, val: string) => {
        setSearchStateState({
            type: val,
        });
        navigate('/home');
    };
    return (
        <div className="w-full h-full">
            <Tabs
                isSticky
                tabsClassName="bg-[#0A0913]"
                activeKey={searchState?.type}
                items={videoCategoryState.map((it) => ({
                    ...it,
                    key: it.value,
                }))}
                tabsItemClassName="text-[18px]"
                onChange={onSearch}
            ></Tabs>
            <AnchorList />
            <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                {searchState?.type && (
                    <div className="flex">
                        <span className="mr-[8px]">
                            {formatLabel(videoCategoryState, searchState?.type)}
                        </span>
                        <Cross2Icon onClick={() => setSearchStateState(null)} />
                    </div>
                )}
            </div>
            <VideoList params={searchState} />
        </div>
    );
};

export default Home;
