import { selector } from 'recoil';
import {
    forgotPasswordState,
    historySearchListState,
    iframeState,
    loginModalState,
    registerState,
} from './atoms';

export const selectorHistorySearchList = selector({
    key: 'selectorHistorySearchList',
    get: ({ get }) => get(historySearchListState),
});

// iframe 显示/隐藏
export const selectorIframe = selector({
    key: 'selectorIframe',
    get: ({ get }) => get(iframeState),
});

export const selectorLoginModalState = selector({
    key: 'selectorLoginModalState',
    get: ({ get }) => get(loginModalState),
});

export const selectorRegisterState = selector({
    key: 'selectorRegisterState',
    get: ({ get }) => get(registerState),
});

export const selectorForgotPasswordState = selector({
    key: 'selectorForgotPasswordState',
    get: ({ get }) => get(forgotPasswordState),
});
