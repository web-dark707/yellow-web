import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import {
    forgotPasswordState,
    historySearchListState,
    iframeState,
    loginState,
    registerState,
} from './atoms';
import { IframeStateType } from './types';

export const useSetHistorySearchList = () => {
    const setValue = useSetRecoilState(historySearchListState);
    return (state: string[]) => {
        setValue(state);
        setStorage('historySearchListState', state);
    };
};

export const useSetIframe = () => {
    const setValue = useSetRecoilState(iframeState);
    return (state: Optional<IframeStateType>) => {
        setValue((prev) => ({
            ...prev,
            ...state,
        }));
    };
};
export const useSetLoginState = () => {
    const setValue = useSetRecoilState(loginState);
    return (state: Optional<boolean>) => {
        setValue(state);
    };
};
export const useSetRegisterState = () => {
    const setValue = useSetRecoilState(registerState);
    return (state: Optional<boolean>) => {
        setValue(state);
    };
};

export const useSetForgotPasswordState = () => {
    const setValue = useSetRecoilState(forgotPasswordState);
    return (state: Optional<boolean>) => {
        setValue(state);
    };
};
