import React from 'react';
import { Overlay } from '@/components/vip-ui';
import './index.scss';

interface Props {
    visible: boolean;
    onCancel: () => void;
}
const Type = ({ onCancel, visible }: Props) => {
    const colorArr = [
        'red',
        'green',
        'magenta',
        'blue',
        'orange',
        'orangellow',
        'strike',
    ];

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
        </Overlay>
    );
};

export default Type;
