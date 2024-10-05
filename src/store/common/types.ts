import { LocaleEnum } from '@/enums/appEnum';

export interface LocaleStateType {
    locale: LocaleEnum;
}

export interface IframeStateType {
    isShowIframe: boolean;
    url: string;
}
