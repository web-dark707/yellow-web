import { atom } from 'recoil';
import { getStorage } from '@/utils/storage';
import { ConfigType } from './types';

// 全局配置
export const configState = atom<ConfigType>({
    key: 'config',
    default: (getStorage('config') ?? {
        initPageStatus: true,
    }) as ConfigType,
});

// 用户信息
export const searchState = atom<string>({
    key: 'searchState',
    default: '',
});
