import { selector } from 'recoil';
import { historySearchListState, iframeState } from './atoms';

export const selectorHistorySearchList = selector({
    key: 'selectorHistorySearchList',
    get: ({ get }) => get(historySearchListState),
});

// iframe 显示/隐藏
export const selectorIframe = selector({
    key: 'selectorIframe',
    get: ({ get }) => get(iframeState),
});
