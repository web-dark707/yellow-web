import { LocaleEnum } from '@/enums/appEnum';
import { DictResult } from '@/types/api/home';

export interface LocaleStateType {
    locale: LocaleEnum;
}

export interface DictStateType extends DictResult {}

export interface IframeStateType {
    isShowIframe: boolean;
    url: string;
}
