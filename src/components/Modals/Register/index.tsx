import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Overlay } from '@/components/vip-ui';
import './index.scss';
import { useSetLoginState, useSetRegisterState } from '@/store/common/hooks';
import { selectorRegisterState } from '@/store/common/selectors';
import { getCaptchaImage, register } from '@/api/login';
import { getQueryString } from '@/utils/tools';
import { useForm } from '@/components/vip-ui/Form';
import { isNumberLetter } from '@/utils/validate';
import { RegisterParams } from '@/types/api/login';
type RegisterModalProps = {};

const RegisterModal: FC<RegisterModalProps> = () => {
    const [form] = useForm();
    const setIsShowRegisterModal = useSetRegisterState();
    const setIsShowLoginModal = useSetLoginState();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const invitationCode = getQueryString('code'); // 邀请码
    const { mutateAsync: mutateRegister, isLoading } = useMutation(register);
    const isShowRegisterModal = useRecoilValue(selectorRegisterState);

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
            invitationCode,
        };
        const res = await mutateRegister(params);
        if (res.code === 200) {
            handleLogin();
        }
    };
    const resetCaptchaImage = useCallback(() => {
        mutateGetCaptchaImage();
    }, [mutateGetCaptchaImage]);

    useEffect(() => {
        resetCaptchaImage();
    }, [resetCaptchaImage]);
    return (
        <Overlay
            visible={isShowRegisterModal}
            onCancel={() => setIsShowRegisterModal(false)}
            closeIcon={<></>}
        >
            <div className="register-container">
                <div>
                    <h2 className="title">注册一个新帐户</h2>
                    <p className="register">
                        或
                        <span onClick={handleLogin} className="font-medium">
                            登入你的帐户
                        </span>
                    </p>
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
                    {/* -------------------------------------------户口号--------------------------------------------- */}
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
                            inputClass="placeholder-[#7E94AF]"
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
                            inputClass="placeholder-[#7E94AF]"
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
                            inputClass="placeholder-[#7E94AF]"
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
                            {/* -------------------------------------------密码--------------------------------------------- */}
                            <Input
                                validator={isNumberLetter}
                                placeholder="验证码"
                                inputClass="placeholder-[#7E94AF]"
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
            </div>
        </Overlay>
    );
};
export default RegisterModal;
