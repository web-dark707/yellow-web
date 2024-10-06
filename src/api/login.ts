import { LoginParams, LoginResult, RegisterParams } from '@/types/api/login';
import { deffHttp } from '@/utils/axios';

enum Api {
    LOGIN_LOGIN = '/api/login',
    LOGIN_REGISTER = '/api/regist',
    LOGIN_CAPTCHA = '/captcha/captchaImage',
}

export const login = (params: LoginParams) =>
    deffHttp.post<LoginResult>(
        {
            url: Api.LOGIN_LOGIN,
            data: params,
        },
        { withToken: false },
    );

export const register = (params: RegisterParams) =>
    deffHttp.post<string>(
        {
            url: Api.LOGIN_REGISTER,
            data: params,
        },
        { withToken: false },
    );
export const getCaptchaImage = () =>
    deffHttp.post<{ url: string }>(
        {
            url: Api.LOGIN_CAPTCHA,
            responseType: 'arraybuffer',
        },
        { withToken: false },
    );
