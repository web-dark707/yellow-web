import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Search from './Search';
const Header = () => {
    const navigate = useNavigate();
    const [isShowSearch, setIsShowSearch] = useState(false);
    return (
        <div className="w-full fixed z-999 top-0 text-baseColor">
            <div className="w-full h-[60px] flex justify-between items-center px-[24px]">
                <div onClick={() => navigate('/home')}>LOGO</div>
                <MagnifyingGlassIcon
                    className="w-[24px] h-[24px]"
                    onClick={() => setIsShowSearch(!isShowSearch)}
                />
            </div>
            {isShowSearch && <Search />}
        </div>
    );
};

export default Header;
