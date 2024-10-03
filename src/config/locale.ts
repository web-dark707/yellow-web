import i18next from 'i18next';
import { LangEnum, LocaleEnum } from '@/enums/appEnum';

export const changeLanguage = (lang: LocaleEnum, isReload = true) => {
    i18next.changeLanguage(lang);
    isReload && location.reload();
};

export const getLanguage = () => {
    return i18next.language as LocaleEnum;
};

export const langList = Object.keys(LangEnum).map((key) => {
    return { label: LangEnum[key], value: key };
});
