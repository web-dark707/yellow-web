import { atom } from 'recoil';
import { getStorage } from '@/utils/storage';
import { ConfigType, SearchType, VideoCategoryType } from './types';

// 全局配置
export const configState = atom<ConfigType>({
    key: 'config',
    default: (getStorage('config') ?? {
        initPageStatus: true,
    }) as ConfigType,
});

// 用户信息
export const searchState = atom<SearchType>({
    key: 'searchState',
    default: null,
});

// 视频分类
export const videoCategoryState = atom<VideoCategoryType[]>({
    key: 'videoCategoryState',
    default: [],
});

// 视频分类
export const currentPageState = atom<number>({
    key: 'currentPageState',
    default: 1,
});
