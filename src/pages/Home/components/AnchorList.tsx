import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { getAnchorList } from '@/api/home';
import { selectorSearchState } from '@/store/config/selectors';
import { useUpdateEffect } from '@/hooks';
import { AnchorListItem } from '@/types/api/home';
import { IMAGE_URL } from '@/common/constants';

const AnchorList = () => {
    const navigate = useNavigate();
    const [anchorList, setAnchorList] = useState<AnchorListItem[]>([]);
    const searchState = useRecoilValue(selectorSearchState);
    const { mutateAsync: mutateGetAnchorList } = useMutation(getAnchorList, {
        onSuccess(res) {
            setAnchorList((prev) => [...prev, ...res.data.records]);
        },
    });

    const getAnchorListAsync = useCallback(() => {
        mutateGetAnchorList(searchState);
    }, [mutateGetAnchorList, searchState]);

    const reset = () => {
        setAnchorList([]);
    };

    const handleClick = (item: AnchorListItem) => {
        navigate(`/anchor?id=${item.id}`);
    };

    // 查询名字时重置数据
    useUpdateEffect(() => {
        reset();
    }, [searchState]);

    // 初始化
    useEffect(() => {
        getAnchorListAsync();
    }, [getAnchorListAsync]);

    return (
        <>
            {anchorList.length > 0 && searchState?.name && (
                <div className="pb-[24px] px-[12px]">
                    <div className="text-[20px] font-semibold px-[12px] mb-[16px]">
                        {searchState.name}
                    </div>
                    <div className="flex mx-[12px] overflow-x-scroll">
                        {anchorList.map((it) => (
                            <div
                                key={it.id}
                                className="w-[90px] text-center"
                                onClick={() => handleClick(it)}
                            >
                                <img
                                    className="w-[80px] h-[80px] rounded-full"
                                    src={it.cover ? IMAGE_URL + it.cover : ''}
                                />
                                <span>{it.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default AnchorList;
