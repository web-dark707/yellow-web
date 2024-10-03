import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';
import { LocaleEnum } from '@/enums/appEnum';
import zh from './zh';
import en from './en';
import kr from './kr';

const langKeyMap = {
    zh: 'zh',
    cn: 'zh',
    en: 'en',
    ko: 'kr',
    kr: 'kr',
};
export const initLang =
    localStorage.getItem('i18nextLng') ||
    LocaleEnum[langKeyMap[navigator.language.slice(0, 2)]] ||
    LocaleEnum.zh;
const resources = {
    zh: {
        translation: {
            ...zh,
        },
    },
    en: {
        translation: {
            ...en,
        },
    },
    kr: {
        translation: {
            ...kr,
        },
    },
};

const detectorOptions = {
    order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
    ],

    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    caches: ['localStorage', 'sessionStorage'],
    excludeCacheFor: ['cimode'],
};

i18n.use(detector)
    .use(initReactI18next)
    .init({
        detection: detectorOptions,
        resources,
        lng: initLang,
        fallbackLng: initLang,
        interpolation: {
            escapeValue: false,
        },
    } as any);

export default i18n;
