import { cloneDeep, isString } from 'lodash';
import { t } from 'i18next';
import { ContentTypeEnum } from '@/enums/httpEnum';
import log from '@/utils/log';
import { Toast } from '@/components/vip-ui';
import { Recordable } from '@/types/common/global';
import Token from '@/common/token';
import type { AxiosInterceptor, CreateAxiosOptions } from './axiosConfig';
import { iAxios } from './iAxios';
import { checkStatus } from './axiosStatus';
import { errorData } from './errorConfig';
import { formatFormData } from '../tools';

/**
 * @description:拦截器配置
 */
const interceptor: AxiosInterceptor = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    requestHook: (res, options) => {
        /**
         *对请求回来的数据进行处理
         */
        const { data } = res;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        if (data) {
            if (data.code !== 200) {
                Toast.error({
                    content: data.msg,
                });
                if ([401].includes(data.code)) {
                    window.location.href = '/login';
                }
                return Promise.resolve(errorData(res));
            } else {
                const temp = cloneDeep(data);
                delete temp['msg'];
                delete temp['code'];
                return Promise.resolve({
                    msg: data?.msg,
                    code: data.code,
                    data: temp,
                });
            }
        }
        return data;
    },

    /**
     * @description: 请求失败的错误处理
     */
    requestCatchHook: (e, _options) => {
        return Promise.reject(e);
    },

    /**
     * @description: 请求之前处理config
     */
    beforeRequestHook: (config, options) => {
        const { urlPrefix } = options;
        if (urlPrefix && isString(urlPrefix))
            config.url = `${urlPrefix}${config.url}`;
        return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config) => {
        const { requestOptions } = config;

        if (requestOptions?.withToken) {
            (config as Recordable).headers[Token.getTokenName()] =
                Token.getToken();
            if (requestOptions?.specialToken)
                (config as Recordable).headers['t'] =
                    requestOptions?.specialToken;
        }

        if (config?.headers?.['Content-Type'] === ContentTypeEnum.FORM_DATA) {
            const formData = new FormData();
            if (config?.data) {
                config.data = formatFormData(config?.data, formData);
            } else {
                config.data = formData;
            }
        }
        return config;
    },

    /**
     * @description: 请求拦截器错误处理
     */
    requestInterceptorsCatch: (error) => {
        log.error('请求拦截错误', error.message);
        return Promise.reject(error);
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res) => {
        if (res.config?.responseType === 'arraybuffer') {
            try {
                const url = window.URL.createObjectURL(
                    new Blob([res.data], { type: 'image/png' }),
                );
                return Object.assign(res, {
                    data: { url, code: 200 },
                });
            } catch (error) {
                console.log(error);
            }
        }
        return res;
    },

    /**
     * @description: 响应拦截器错误处理
     */
    responseInterceptorsCatch: (error: any) => {
        // log.error('响应拦截错误', error);

        const { response } = error || {};
        checkStatus(response ? response?.status : 500);
        if (error.code === 'ECONNABORTED') {
            Toast.error(t('app.message.error.http408'));
        }
        if (response?.status === 401) {
            Token.clearToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
};

function createAxios(options?: Partial<CreateAxiosOptions>) {
    return new iAxios({
        ...{
            // 请求时间
            timeout: 15 * 1000,
            // (拦截器)数据处理方式
            interceptor,
            headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
            // 配置项（需要在拦截器中做的处理），下面的选项都可以在独立的接口请求中覆盖
            requestOptions: {
                withToken: true,
            },
        },
        ...(options || {}),
    });
}
export const deffHttp = createAxios();
