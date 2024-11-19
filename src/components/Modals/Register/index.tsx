import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Overlay } from '@/components/vip-ui';
import './index.scss';
import {
    useSetLoginModalState,
    useSetRegisterState,
} from '@/store/common/hooks';
import { selectorRegisterState } from '@/store/common/selectors';
import { getCaptchaImage, register } from '@/api/login';
import { useForm } from '@/components/vip-ui/Form';
import { isNumberLetter } from '@/utils/validate';
import { RegisterParams } from '@/types/api/login';
import { getStorage } from '@/utils/storage';
import { getTrack } from '@/api/home';
import { TrackParams } from '@/types/api/home';
type RegisterModalProps = {};

const RegisterModal: FC<RegisterModalProps> = () => {
    const [form] = useForm();
    const setIsShowRegisterModal = useSetRegisterState();
    const setIsShowLoginModal = useSetLoginModalState();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const invitationCodeBy = (getStorage('invitationCodeBy') as string) ?? '';
    const { mutateAsync: mutateRegister, isLoading } = useMutation(register);
    const isShowRegisterModal = useRecoilValue(selectorRegisterState);
    const { mutateAsync: mutateGetTrack } = useMutation(getTrack);
    const { mutateAsync: mutateGetCaptchaImage, data } =
        useMutation(getCaptchaImage);
    const handleLogin = () => {
        setIsShowRegisterModal(false);
        setIsShowLoginModal(true);
    };
    const onSubmit = async (values) => {
        const params: RegisterParams = {
            username: values.username,
            password: values.password,
            captcha: values.captcha,
            invitationCodeBy,
        };
        const res = await mutateRegister(params);
        if (res.code === 200) {
            handleLogin();
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

    useEffect(() => {
        const params: TrackParams = {
            event: invitationCodeBy
                ? 'click_regist_url'
                : 'click_regist_button',
            properties: { invitationCodeBy },
        };
        mutateGetTrack(params);
    }, [invitationCodeBy, mutateGetTrack]);

    return (
        <Overlay
            visible={isShowRegisterModal}
            onCancel={() => setIsShowRegisterModal(false)}
        >
            <div className="register-container">
                <div>
                    <h2 className="title">注册一个新帐户</h2>
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
                    <Form.Item
                        field="username"
                        className="w-full"
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
                    <Form.Item
                        field="repeat-password"
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: '请输入确认密码',
                            },
                            {
                                validator: (value, callback) => {
                                    if (
                                        value !== form.getFieldValue('password')
                                    ) {
                                        callback(
                                            '两次输入密码不一致,请重新输入',
                                        );
                                    }
                                    return Promise.resolve(true);
                                },
                            },
                        ]}
                    >
                        {/* -------------------------------------------密码--------------------------------------------- */}
                        <Input
                            type="password"
                            placeholder="确认密码"
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
                    注册
                </Button>
                <p className="register" onClick={handleLogin}>
                    登入你的帐户
                </p>
            </div>
        </Overlay>
    );
};
export default RegisterModal;
