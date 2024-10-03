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
