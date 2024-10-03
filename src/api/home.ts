import { deffHttp } from '@/utils/axios';

enum Api {
    DATING_GIRLS = '/api/videoList',
}

// 获取汇率
export const getVideoList = () => {
    return deffHttp.post<any[]>({
        url: Api.DATING_GIRLS,
    });
};
