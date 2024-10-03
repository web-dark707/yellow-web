import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import UserToken from '@/common/token';
import { Input, Form, Button, Toast } from '@/components/vip-ui';
import { useForm } from '@/components/vip-ui/Form';
import { login } from '@/api/login';
import { LoginParams } from '@/types/api/login';

type LoginPageProps = {};

const LoginPage: FC<LoginPageProps> = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loginDisabled, setLoginDisabled] = useState(true);
    const [form] = useForm();
    const { mutateAsync: mutateUserLogin, isLoading } = useMutation(login);
    const fetchUserLogin = async (values) => {
        const params: LoginParams = {
            username: values.username,
            pwd: values.pwd,
        };
        const res = await mutateUserLogin(params);

        if (res.code) {
            Toast.error(res.msg);
        } else {
            Toast.success(t('app.message.success.login'));
            UserToken.setToken(res.data);
            navigate('/', { replace: true });
        }
    };

    const onSubmit = (values: any) => {
        fetchUserLogin(values);
    };

    useEffect(() => {
        if (UserToken.getToken()) navigate('/', { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full flex flex-col justify-center  min-h-full">
            <Form
                form={form}
                onSubmit={onSubmit}
                className="flex justify-between text-[16px] text-[#fff] min-h-[150px] mt-[38px] mx-[12px]"
                onValuesChange={() => {
                    form.getFieldsError().then((res) => {
                        setLoginDisabled(res.hasError);
                    });
                }}
            >
                <div className="bg-[#3A4252] flex-1 flex flex-col justify-around items-center rounded-xl px-[8px] py-[12px]">
                    {/* -------------------------------------------户口号--------------------------------------------- */}
                    <Form.Item
                        field="username"
                        className="w-full"
                        label="帐号"
                        rules={[
                            {
                                required: true,
                                message: '请输入帐号',
                            },
                        ]}
                    >
                        <Input
                            placeholder={'请输入帐号'}
                            inputClass="placeholder-[#bbb]"
                            className="h-[40px] text-[#222] border-1 border-solid border-[#c2c2c2] bg-[#fff] rounded-md mb-[8px]"
                        />
                    </Form.Item>
                    <Form.Item
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                        field="pwd"
                        label="密码"
                    >
                        {/* -------------------------------------------密码--------------------------------------------- */}
                        <Input
                            type="password"
                            placeholder={'请输入密码'}
                            inputClass="placeholder-[#bbb]"
                            className="h-[40px] text-[#222] border-1 border-solid border-[#c2c2c2] bg-[#fff] rounded-md mb-[8px]"
                        />
                    </Form.Item>
                </div>
            </Form>
            <Button
                onClick={() => form.submit()}
                disabled={loginDisabled}
                loading={isLoading}
                background="bg-[#FE618E]"
                className="w-[340px] mx-auto h-[40px] text-[18px]  mt-[20px]"
            >
                登入
            </Button>
            <div
                className="text-center mt-[16px] text-[#fff]"
                onClick={() => navigate('/register')}
            >
                去註冊
            </div>
        </div>
    );
};
export default LoginPage;
