import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useRecoilValue } from 'recoil';
import { Button } from '@/components/vip-ui';
import { useSetLoginModalState } from '@/store/common/hooks';
import { selectorUserDetailState } from '@/store/user/selectors';
const User = () => {
    const navigate = useNavigate();
    const setIsShowLoginModal = useSetLoginModalState();
    const userDetailState = useRecoilValue(selectorUserDetailState);
    const handlePay = () => {
        if (userDetailState) {
            navigate('/pay');
        } else {
            setIsShowLoginModal(true);
        }
    };
    const handleLogin = () => {
        setIsShowLoginModal(true);
    };
    return (
        <div className="w-full h-full pt-[24px]">
            <div className="mx-[12px] rounded-[12px] overflow-hidden">
                <div className="user-card-bg w-full h-[80px] px-[40px] flex justify-between pt-[12px]">
                    <div className="flex flex-col">
                        {userDetailState ? (
                            <>
                                <div className="flex items-end">
                                    <span className="text-[20px] font-bold">
                                        {userDetailState.username}
                                    </span>
                                    <img
                                        className="w-[18px] h-[18px] ml-[4px]"
                                        src={
                                            userDetailState.isVip
                                                ? require('@/assets/images/user/vip.webp')
                                                : require('@/assets/images/user/un_vip.webp')
                                        }
                                    />
                                </div>
                                {!userDetailState.isVip && (
                                    <div className="text-[#969699] mt-[6px]">
                                        您还没有开通vip
                                    </div>
                                )}
                            </>
                        ) : (
                            <div onClick={handleLogin} className="text-[16px]">
                                登录/注册
                            </div>
                        )}
                    </div>
                    <Button className="w-[90px] h-[36px]" onClick={handlePay}>
                        开通VIP
                    </Button>
                </div>
                <div className="user-card-gradient w-full h-[200px] pt-[12px]">
                    <div className="text-[16px] text-[#972d19] text-center font-bold">
                        VIP特权
                    </div>
                </div>
            </div>
            <div className="mt-[24px]">
                <div className="mx-[16px] py-[12px] flex justify-between items-center border-b-1 border-solid border-[#333]">
                    <span>常见问题</span>
                    <ChevronRightIcon className="w-[24px] h-[24px]" />
                </div>
                <div className="mx-[16px] py-[12px] flex justify-between items-center border-b-1 border-solid border-[#333]">
                    <span>联系客服</span>
                    <ChevronRightIcon className="w-[24px] h-[24px]" />
                </div>
            </div>
        </div>
    );
};

export default User;
