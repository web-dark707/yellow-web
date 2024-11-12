import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Overlay } from '@/components/vip-ui';
import './index.scss';
import Checkbox from '@/components/Checkbox';
import {
    selectorLoginModalState,
    selectorRegisterState,
} from '@/store/common/selectors';
import {
    useSetLoginModalState,
    useSetRegisterState,
} from '@/store/common/hooks';
import Form, { useForm } from '@/components/vip-ui/Form';
import { isNumberLetter } from '@/utils/validate';
import { getCaptchaImage, login } from '@/api/login';
import { LoginParams } from '@/types/api/login';
import { useSetTokenInfoState } from '@/store/user/hooks';
import { getStorage, setStorage } from '@/utils/storage';
import UserToken from '@/common/token';
import { useUpdateEffect } from '@/hooks';
type LoginModalProps = {};

const LoginModal: FC<LoginModalProps> = () => {
    const [form] = useForm();
    const setTokenInfo = useSetTokenInfoState();
    const setIsShowLoginModal = useSetLoginModalState();
    const setIsShowRegisterModal = useSetRegisterState();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const isShowRegisterModal = useRecoilValue(selectorRegisterState);
    const isShowLoginModal = useRecoilValue(selectorLoginModalState);
    const [checkState, setCheckState] = useState(false);
    const { mutateAsync: mutateLogin, isLoading } = useMutation(login);
    const { mutateAsync: mutateGetCaptchaImage, data } =
        useMutation(getCaptchaImage);

    const handleRegister = () => {
        setIsShowRegisterModal(true);
    };
    const onSubmit = async (values) => {
        const params: LoginParams = {
            username: values.username,
            password: values.password,
            captcha: values.captcha,
        };
        const res = await mutateLogin(params);
        if (res.code === 200) {
            if (res.data.tokenInfo) {
                setTokenInfo(res.data.tokenInfo);
                UserToken.setToken(
                    res.data.tokenInfo.tokenName,
                    res.data.tokenInfo.tokenValue,
                );
                if (checkState) setStorage('username', values.username);
            }
            setIsShowLoginModal(false);
        } else {
            resetCaptchaImage();
        }
    };

    const resetCaptchaImage = useCallback(() => {
        mutateGetCaptchaImage();
    }, [mutateGetCaptchaImage]);

    useEffect(() => {
        resetCaptchaImage();
    }, [resetCaptchaImage]);

    useUpdateEffect(() => {
        if (!isShowRegisterModal) {
            resetCaptchaImage();
        }
    }, [isShowRegisterModal]);

    return (
        <Overlay
            visible={isShowLoginModal}
            onCancel={() => setIsShowLoginModal(false)}
        >
            <div className="login-container">
                <div>
                    <h2 className="title">登入你的帐户</h2>
                </div>
                <Form
                    form={form}
                    onSubmit={onSubmit}
                    className="bg-[#fff] mt-[12px] rounded-md"
                    onValuesChange={() => {
                        form.getFieldsError().then((res) => {
                            setLoginDisabled(res.hasError);
                        });
                    }}
                >
                    {/* -------------------------------------------账号--------------------------------------------- */}
                    <Form.Item
                        field="username"
                        className="w-full"
                        initialValue={getStorage('username')}
                        rules={[
                            {
                                required: true,
                                message: '请输入账号',
                            },
                            {
                                validator: (val, callback) => {
                                    if (val.length < 4) callback('账号最少4位');
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="账号"
                            validator={isNumberLetter}
                            inputClass="placeholder-[#666666]"
                            className="h-[48px] text-[#222] border-b-1 border-solid border-[#c2c2c2] bg-[#fff]"
                        />
                    </Form.Item>
                    <Form.Item
                        className="w-full"
                        field="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                            {
                                validator: (value, callback) => {
                                    if (form.getFieldValue('repeat-password')) {
                                        form.validateField('repeat-password');
                                    }
                                    return Promise.resolve(true);
                                },
                            },
                        ]}
                    >
                        {/* -------------------------------------------密码--------------------------------------------- */}
                        <Input
                            type="password"
                            placeholder="密码"
                            inputClass="placeholder-[#666666]"
                            className="h-[48px] text-[#222] border-b-1 border-solid border-[#c2c2c2] bg-[#fff]"
                        />
                    </Form.Item>
                    <div className="flex">
                        <Form.Item
                            field="captcha"
                            className="w-full"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码',
                                },
                            ]}
                        >
                            {/* -------------------------------------------验证码--------------------------------------------- */}
                            <Input
                                validator={isNumberLetter}
                                placeholder="验证码"
                                inputClass="placeholder-[#666666]"
                                className="h-[48px] text-[#222] bg-[#fff]"
                            />
                        </Form.Item>
                        {data?.data?.url && (
                            <img
                                className="h-full"
                                onClick={() => resetCaptchaImage()}
                                src={data?.data?.url}
                            />
                        )}
                    </div>
                </Form>

                <Button
                    onClick={() => form.submit()}
                    disabled={loginDisabled}
                    loading={isLoading}
                    className="login-btn"
                >
                    登入
                </Button>

                <div className="other flex justify-between">
                    <Checkbox
                        value={1}
                        checked={checkState}
                        label={'记住我'}
                        onChange={() => setCheckState(!checkState)}
                    />
                    <p className="register" onClick={handleRegister}>
                        注册一个新帐户
                    </p>
                    {/* <a href="#" onClick={() => {}}>
                        忘记密码?
                    </a> */}
                </div>
            </div>
        </Overlay>
    );
};
export default LoginModal;
