import React from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Overlay } from '@/components/vip-ui';
import { useSetSearchStateState } from '@/store/config/hooks';
import { selectorVideoCategoryState } from '@/store/config/selectors';
interface Props {
    visible: boolean;
    onCancel: () => void;
}
const Type = ({ onCancel, visible }: Props) => {
    const navigate = useNavigate();
    const setSearchStateState = useSetSearchStateState();
    const videoCategoryState = useRecoilValue(selectorVideoCategoryState);

    const onSearch = (val: string) => {
        setSearchStateState({
            typeId: val,
        });
        navigate('/home');
        onCancel();
    };

    return (
        <Overlay
            visible={visible}
            onCancel={onCancel}
            closeIcon={<></>}
            className="text-[#fff] !justify-start p-[24px]"
        >
            <div className="text-[24px] text-primaryColor text-center">
                热门分类
            </div>
            <div className="w-full py-[12px] flex flex-wrap text-[20px] mb-[12px]">
                {videoCategoryState.map((it) => (
                    <div
                        className="w-1/2 text-center whitespace-pre mt-[16px]"
                        key={it.value}
                        onClick={() => onSearch(it.value)}
                    >
                        <span className="text-[#6190c9]">#</span>
                        {it.label}
                    </div>
                ))}
            </div>
        </Overlay>
    );
};

export default Type;
