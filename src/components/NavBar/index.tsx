import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useSetSearchStateState } from '@/store/config/hooks';
import Search from './Search';
const Header = () => {
    const navigate = useNavigate();
    const setSearchStateState = useSetSearchStateState();
    const [isShowSearch, setIsShowSearch] = useState(false);
    const handleClick = () => {
        navigate('/home');
        setSearchStateState('');
    };

    return (
        <div className="w-full fixed z-9 top-0 text-baseColor">
            <div className="w-full h-[60px] flex justify-between items-center px-[24px]">
                <div
                    className="text-4xl leading-normal font-extrabold"
                    onClick={handleClick}
                >
                    <span className="text-[#FAFAFA]">KK</span>
                    <span className="text-[#FE618E]">PRON</span>
                </div>
                <div className="flex">
                    <MagnifyingGlassIcon
                        className="w-[24px] h-[24px] mr-[8px]"
                        onClick={(e) => setIsShowSearch(true)}
                    />

                    {/* <TextAlignJustifyIcon className="w-[24px] h-[24px]" /> */}
                </div>
            </div>
            {isShowSearch && (
                <Search
                    onCancel={() => setIsShowSearch(false)}
                    visible={isShowSearch}
                />
            )}
        </div>
    );
};

export default Header;
