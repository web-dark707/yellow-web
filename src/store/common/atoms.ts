import { atom } from 'recoil';
import { initLang } from '@/locales';
import { getStorage } from '@/utils/storage';
import { IframeStateType, LocaleStateType } from './types';

export const localeState = atom<LocaleStateType>({
    key: 'localeState',
    default: {
        locale: initLang,
    },
});

export const historySearchListState = atom<string[]>({
    key: 'historySearchListState',
    default: getStorage('historySearchListState') || [],
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
