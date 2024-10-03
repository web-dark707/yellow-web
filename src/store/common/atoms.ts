import { atom } from 'recoil';
import { initLang } from '@/locales';
import { getStorage } from '@/utils/storage';
import { LocaleStateType } from './types';

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
