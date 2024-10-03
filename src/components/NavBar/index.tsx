import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Search from './Search';
const Header = () => {
    const navigate = useNavigate();
    const [isShowSearch, setIsShowSearch] = useState(false);

    return (
        <div className="w-full fixed z-9 top-0 text-baseColor">
            <div className="w-full h-[60px] flex justify-between items-center px-[24px]">
                <div
                    className="text-4xl leading-normal font-extrabold"
                    onClick={() => navigate('/home')}
                >
                    <span className="text-[#FAFAFA]">KK</span>
                    <span className="text-[#FE618E]">PRON</span>
                </div>
                <MagnifyingGlassIcon
                    className="w-[24px] h-[24px]"
                    onClick={(e) => setIsShowSearch(true)}
                />
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
