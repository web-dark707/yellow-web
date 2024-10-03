import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/vip-ui';

type NotAuthorityProps = {};

const NotAuthority: FC<NotAuthorityProps> = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <img
                src={require('@/assets/images/common/403.webp')}
                alt="403"
                className="w-[212px] mt-[140px]"
            />
            <span className="text-[#808080] mt-[16px]">
                {t('app.ui.noAccess')}
            </span>
            <div className="flex-row-center w-full">
                <Button
                    onClick={() => navigate('/')}
                    className="mt-[34px] w-[40%] h-36px"
                >
                    {t('app.ui.toHome')}
                </Button>
            </div>
        </div>
    );
};

export default NotAuthority;
