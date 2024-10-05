import React, { useState } from 'react';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/vip-ui';
import { payTypeList } from '@/common/options/record';
import { getPay } from '@/api/pay';
import { useSetIframe } from '@/store/common/hooks';

const Pay = () => {
    const setIframe = useSetIframe();

    const [bankCode, setBankCode] = useState<string>('ZFB');
    const [payType, setPayType] = useState(1);
    const { mutateAsync: mutateGetPay } = useMutation(getPay);
    const typeOptions = [
        // vip充值
        {
            amount: 100,
            payType: 1,
            title: '永久',
            subtitle: 'VIP会员',
            icon: require('@/assets/images/pay/vip.png'),
            unicon: require('@/assets/images/pay/un_vip.png'),
        },
        // 金币充值
        {
            amount: 100,
            payType: 2,
            title: '冲100送50',
            subtitle: '金币充值',
            icon: require('@/assets/images/pay/coins.png'),
            unicon: require('@/assets/images/pay/un_coins.png'),
        },
    ];
    const handlePay = async () => {
        const res = await mutateGetPay({
            bankCode: bankCode,
            amount: 100,
            memberId: 123456,
            payType: 1,
        });
        if (res.code === 200) {
            setIframe({
                url: res.data.url,
                isShowIframe: true,
            });
        }
    };
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div>
                <div className="px-[16px]">
                    <div className="text-[#fff] text-[18px]">name</div>
                    <div className="text-[#6f6f71]">暂无开通会员</div>
                </div>
                <div className="flex justify-around">
                    {typeOptions.map((it) => (
                        <div
                            onClick={() => setPayType(it.payType)}
                            key={it.payType}
                            className={classNames(
                                'w-[120px] h-[140px] mx-auto text-center flex flex-col justify-between mt-[24px]',
                                payType === it.payType
                                    ? 'vip-card-bg'
                                    : 'un-vip-card-bg',
                            )}
                        >
                            <div
                                className={classNames(
                                    ' text-[16px] mt-[20px] font-bold',
                                    payType === it.payType
                                        ? 'text-[#972d19]'
                                        : 'text-[#6f6f71]',
                                )}
                            >
                                {it.title}
                            </div>
                            <div
                                className={classNames(
                                    'text-[24px] font-extrabold',
                                    payType === it.payType
                                        ? 'text-[#E62C17]'
                                        : 'text-[#671E18]',
                                )}
                            >
                                {it.amount}¥
                            </div>
                            <div
                                className={classNames(
                                    ' flex justify-center items-center mb-[4px]',
                                    payType === it.payType
                                        ? 'text-[#feadae]'
                                        : 'text-[#6f6f71]',
                                )}
                            >
                                <img
                                    className="w-[20px] h-[20px] mr-[4px]"
                                    src={
                                        payType === it.payType
                                            ? it.icon
                                            : it.unicon
                                    }
                                />
                                <span>{it.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-[24px]">
                    {payTypeList.map((it) => (
                        <div
                            className="flex justify-between px-[24px] mb-[16px] text-[16px]"
                            key={it.value}
                            onClick={() => setBankCode(it.value)}
                        >
                            <div className="flex items-center">
                                <img
                                    className="w-[24px] h-[24px] mr-[10px]"
                                    src={it.icon}
                                />
                                <span>{it.label}</span>
                            </div>
                            {bankCode === it.value ? (
                                <img
                                    className="w-[24px] h-[24px]"
                                    src={require('@/assets/images/pay/checked.png')}
                                />
                            ) : (
                                <img
                                    className="w-[24px] h-[24px]"
                                    src={require('@/assets/images/pay/unchecked.png')}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center p-[12px] bg-[#101012] border-t-1 border-solid border-[#333]">
                <div className="flex items-center">
                    <span>总计:&nbsp;</span>
                    <span className="text-[#E62C17] text-[22px] font-extrabold">
                        100¥
                    </span>
                </div>
                <Button onClick={handlePay} className="w-[60px] flex-shrink-0">
                    支付
                </Button>
            </div>
        </div>
    );
};

export default Pay;
