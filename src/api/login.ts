import { LoginParams, RegisterParams } from '@/types/api/login';
import { deffHttp } from '@/utils/axios';

enum Api {
    LOGIN_LOGIN = '/api/login',
    LOGIN_REGISTER = '/api/register',
}

export const login = (params: LoginParams) =>
    deffHttp.post<string>(
        { url: Api.LOGIN_LOGIN, data: params },
        { withToken: false },
    );

export const register = (params: RegisterParams) =>
    deffHttp.post<string>(
        { url: Api.LOGIN_REGISTER, data: params },
        { withToken: false },
    );
