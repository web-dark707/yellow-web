import React, { useState } from 'react';
import { MagnifyingGlassIcon, TrashIcon } from '@radix-ui/react-icons';
import { useRecoilValue } from 'recoil';
import { Input } from '@/components/vip-ui';
import { selectorHistorySearchList } from '@/store/common/selectors';
import { useSetHistorySearchList } from '@/store/common/hooks';

const Search = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const historySearchList = useRecoilValue(selectorHistorySearchList);
    const setHistorySearchList = useSetHistorySearchList();
    const handelInput = (e) => {
        console.log(e.target.value);
        setInputValue(e.target.value);
    };
    const handleSearch = () => {
        if (inputValue === '') return;
        // 只留9条
        setHistorySearchList([inputValue, ...historySearchList.slice(0, 9)]);
        setInputValue('');
    };

    const handleClickHistory = (val: string) => {
        console.log(val);
    };
    return (
        <div className="px-[24px] w-full h-[38px]">
            <div className="h-full flex items-center  border border-solid border-[#80A1C1]">
                <Input
                    className="h-full border-none"
                    placeholder="输入搜索内容"
                    value={inputValue}
                    onInput={handelInput}
                />
                <div
                    onClick={handleSearch}
                    className="bg-[#80A1C1] w-[80px] flex-row-center h-full"
                >
                    <MagnifyingGlassIcon className="w-[24px] h-[24px]" />
                    <span>搜索</span>
                </div>
            </div>
            <div className="flex flex-wrap text-[#EBCB8B] text-[16px] mt-[12px] relative">
                {historySearchList.map((it, i) => (
                    <div
                        className="mr-[2px] "
                        onClick={() => handleClickHistory(it)}
                        key={i}
                    >
                        {it}
                        {i !== historySearchList.length - 1 && ','}
                    </div>
                ))}
                {historySearchList.length > 0 && (
                    <TrashIcon
                        onClick={() => setHistorySearchList([])}
                        className="w-[24px] h-[24px] absolute right-[20px] -bottom-[4px]"
                        color="#B8BABC"
                    />
                )}
            </div>
        </div>
    );
};

export default Search;
