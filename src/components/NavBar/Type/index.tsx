import React from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Overlay } from '@/components/vip-ui';
import { useSetSearchStateState } from '@/store/config/hooks';
import { selectorVideoCategoryState } from '@/store/config/selectors';
import './index.scss';

interface Props {
    visible: boolean;
    onCancel: () => void;
}
const Type = ({ onCancel, visible }: Props) => {
    const navigate = useNavigate();
    const setSearchStateState = useSetSearchStateState();
    const videoCategoryState = useRecoilValue(selectorVideoCategoryState);
    const colorArr = [
        'red',
        'green',
        'magenta',
        'blue',
        'orange',
        'orangellow',
        'strike',
    ];
    const onSearch = (val: string) => {
        setSearchStateState({
            type: val,
        });
        navigate('/home');
        onCancel();
    };

    return (
        <Overlay
            visible={visible}
            onCancel={onCancel}
            closeIcon={<></>}
            className="text-[#fff] !justify-start p-[32px]"
        >
            <div className="text-[24px] text-primaryColor text-center mb-[24px]">
                热门分类
            </div>
            <div className="w-full flex justify-between flex-wrap text-[20px]">
                {videoCategoryState.map((it, i) => (
                    <button
                        className="btn w-[140px] rounded-[5px] flex-shrink-0 mt-[16px] text-[#333] px-[12px] py-[10px]"
                        key={it.value}
                        onClick={() => onSearch(it.value)}
                    >
                        {it.label}
                    </button>
                ))}
            </div>
        </Overlay>
    );
};

export default Type;
