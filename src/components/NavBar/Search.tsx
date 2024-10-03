import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/vip-ui';

const Search = () => {
    const [inputValue, setInputValue] = useState<undefined | string>('');
    const handelInput = (e) => {
        console.log(e.target.value);
        setInputValue(e.target.value);
    };
    const handleSearch = () => {
        console.log(inputValue);
    };
    return (
        <div className="px-[24px] w-full h-[38px]">
            <div className="h-full flex items-center  border border-solid border-[#80A1C1]">
                <Input
                    className="h-full border-none"
                    placeholder="输入搜索内容"
                    onInput={handelInput}
                />
                <div className="bg-[#80A1C1] w-[80px] flex-row-center h-full">
                    <MagnifyingGlassIcon
                        className="w-[24px] h-[24px]"
                        onClick={handleSearch}
                    />
                    <span>搜索</span>
                </div>
            </div>
        </div>
    );
};

export default Search;
