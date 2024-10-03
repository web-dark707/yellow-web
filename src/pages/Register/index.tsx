import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import UserToken from '@/common/token';
import { Input, Form, Button, Toast } from '@/components/vip-ui';
import { useForm } from '@/components/vip-ui/Form';
import { getQueryString } from '@/utils/tools';
import { register } from '@/api/login';
import { RegisterParams } from '@/types/api/login';

type RegisterPageProps = {};

const RegisterPage: FC<RegisterPageProps> = () => {
    const navigate = useNavigate();
    const activationCode = getQueryString('code'); // 邀请码
    const [loginDisabled, setLoginDisabled] = useState(true);
    const [form] = useForm();
    const location = useLocation();
    const { mutateAsync: mutateRegister, isLoading } = useMutation(register);

    const fetchUserLogin = async (values) => {
        const params: RegisterParams = {
            username: values.username,
            pwd: values.pwd,
            activationCode: values.activationCode,
        };
        const res = await mutateRegister(params);

        if (res.code) {
            Toast.error(res.message);
        } else {
            Toast.success('注册成功');
            UserToken.setToken(res.data);
            navigate('/', { replace: true });
        }
    };

    const onSubmit = (values: any, result: any) => {
        fetchUserLogin(values);
    };

    useEffect(() => {
        if (UserToken.getToken()) navigate('/', { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full flex-col-center-start min-h-full bg-[#C95793]">
            <Form
                form={form}
                onSubmit={onSubmit}
                className="flex justify-between text-[16px] text-[#fff] min-h-[180px] mt-[38px] mx-[12px]"
                onValuesChange={() => {
                    form.getFieldsError().then((res) => {
                        setLoginDisabled(res.hasError);
                    });
                }}
            >
                <div className="bg-[#EA82B4] text-[18px] font-bold w-[90px] px-[8px] flex flex-col justify-around items-center mr-[8px] rounded-xl flex-shrink-0">
                    <div>帳號</div>
                    <div>密碼</div>
                    <div>重複密碼</div>
                    <div>啟用設定</div>
                </div>
                <div className="bg-[#BF2A81] flex-1 flex flex-col justify-around items-center rounded-xl px-[8px] py-[12px]">
                    {/* -------------------------------------------户口号--------------------------------------------- */}
                    <Form.Item
                        field="username"
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: '請輸入帳號',
                            },
                        ]}
                    >
                        <Input
                            placeholder={'請輸入帳號'}
                            inputClass="placeholder-[#bbb]"
                            className="h-[40px] text-[#222] border-1 border-solid border-[#c2c2c2] bg-[#fff] rounded-md mb-[8px]"
                        />
                    </Form.Item>
                    <Form.Item
                        className="w-full"
                        field="pwd"
                        rules={[
                            {
                                required: true,
                                message: '請輸入密碼',
                            },
                            {
                                validator: (value, callback) => {
                                    if (form.getFieldValue('repeat-pwd')) {
                                        form.validateField('repeat-pwd');
                                    }
                                    return Promise.resolve(true);
                                },
                            },
                        ]}
                    >
                        {/* -------------------------------------------密码--------------------------------------------- */}
                        <Input
                            type="password"
                            placeholder={'請輸入密碼'}
                            inputClass="placeholder-[#bbb]"
                            className="h-[40px] text-[#222] border-1 border-solid border-[#c2c2c2] bg-[#fff] rounded-md mb-[8px]"
                        />
                    </Form.Item>
                    <Form.Item
                        field="repeat-pwd"
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: '請輸入重複密碼',
                            },
                            {
                                validator: (value, callback) => {
                                    if (value !== form.getFieldValue('pwd')) {
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
                            placeholder={'請輸入重複密碼'}
                            inputClass="placeholder-[#bbb]"
                            className="h-[40px] text-[#222] border-1 border-solid border-[#c2c2c2] bg-[#fff] rounded-md mb-[8px]"
                        />
                    </Form.Item>
                    <Form.Item
                        field="activationCode"
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: '請輸入啟用設定',
                            },
                        ]}
                        initialValue={activationCode}
                    >
                        <Input
                            placeholder={'請輸入啟用設定'}
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
                className="w-[340px] mx-auto h-[40px] text-[18px]  mt-[20px] border-1 border-solid border-[#fff]"
            >
                註冊
            </Button>
        </div>
    );
};
export default RegisterPage;
