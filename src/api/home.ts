import {
    UserResult,
    VideoDetailsResult,
    VideoListResult,
    VideoParams,
} from '@/types/api/home';
import { deffHttp } from '@/utils/axios';

enum Api {
    API_VIDEO_LIST = '/api/videoList',
    API_VIDEO_DETAIL = '/api/videoDetail',
    API_USER_DETAIL = '/api/userDetail',
}

// 获取视频列表
export const getVideoList = (params: VideoParams) => {
    return deffHttp.post<VideoListResult>({
        url: Api.API_VIDEO_LIST,
        data: params,
    });
};

export const getVideoDetails = (params: { id: string }) => {
    return deffHttp.post<VideoDetailsResult>({
        url: Api.API_VIDEO_DETAIL,
        data: params,
    });
};

export const getUserDetails = (params: { id: string }) => {
    return deffHttp.post<UserResult>({
        url: Api.API_USER_DETAIL,
        data: params,
    });
};
