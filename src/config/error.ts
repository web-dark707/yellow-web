import axios from 'axios';
import { getStorage } from '@/utils/storage';
import { isProdMode } from './env';

export const ENV_TYPE: Record<string, number> = {
    'https://oa-h5-v2.vipsroom.net': 1, //开发
    'https://t-oa-h5-v2.vipsroom.net': 2, //测试
    'https://pre-oa-h5-v2.vipsroom.net': 3, //预发布
    'https://star99.app/': 4, //生产
};

//获取环境类型
export const getEnvType = () => {
    const url = window.location.href;
    let envType = 0;
    for (const key in ENV_TYPE) {
        if (url.includes(key)) {
            envType = ENV_TYPE[key];
            break;
        }
    }
    return envType;
};

/**
 * @description:上报错误 ;
 */
export const sendError = (params: {
    detail: string; // 错误详情
}) =>
    isProdMode() &&
    axios.post('https://google-admin.vipsroom.net/api/error-monitor/create', {
        urlPath: window.location.href,
        account: (getStorage('userInfo') as any)?.member_code || '',
        projectType: 2, // 1帐房, 2钱包APP
        env: getEnvType(),
        errorType: 1,
        ...params,
    });
