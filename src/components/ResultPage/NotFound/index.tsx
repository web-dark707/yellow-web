import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/vip-ui';

type NotFoundProps = {};

const NotFound: FC<NotFoundProps> = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="w-full flex-col-center">
            <img
                src={require('@/assets/images/common/404.webp')}
                alt="404"
                className="w-[212px] mt-[140px]"
            />
            <span className="text-[#808080] mt-[16px]">
                {t('app.ui.pageToExist')}
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

export default NotFound;
