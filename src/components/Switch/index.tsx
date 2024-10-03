import React, { FC } from 'react';
import classNames from 'classnames';

type SwitchProps = {
    status: boolean;
    onChange?: (status: boolean) => void;
};

const Switch: FC<SwitchProps> = ({ status = false, onChange }) => {
    return (
        <div
            className={`w-16 h-8 rounded-full p-1 cursor-pointer ${
                status ? 'button-gradient' : 'bg-[#A5A5A5]'
            }`}
            onClick={() => {
                onChange?.(!status);
            }}
        >
            <div
                className={classNames(
                    `w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out`,
                    {
                        'translate-x-[24px]': status,
                    },
                )}
            ></div>
        </div>
    );
};
export default Switch;
