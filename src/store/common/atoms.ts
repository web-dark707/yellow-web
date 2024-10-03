import { atom } from 'recoil';
import { initLang } from '@/locales';
import { getStorage } from '@/utils/storage';
import { DictStateType, IframeStateType, LocaleStateType } from './types';

export const localeState = atom<LocaleStateType>({
    key: 'localeState',
    default: {
        locale: initLang,
    },
});

/**
 *  配置信息
 */
export const dictState = atom<DictStateType>({
    key: 'dictState',
    default: (getStorage('dict') || {}) as DictStateType,
});

/**
 *  iframe 显示/隐藏
 */
export const iframeState = atom<IframeStateType>({
    key: 'iframeState',
    default: {
        isShowIframe: false,
        url: '',
    },
});

export const hasOpenState = atom<any>({
    key: 'hasOpen',
    default: (getStorage('hasOpen') || false) as any,
});
