import { selector } from 'recoil';
import { dictState, hasOpenState, iframeState } from './atoms';

// 获取配置
export const selectorDict = selector({
    key: 'selectorDict',
    get: ({ get }) => get(dictState),
});
export const selectorHasOpen = selector({
    key: 'selectorHasOpen',
    get: ({ get }) => get(hasOpenState),
});

// iframe 显示/隐藏
export const selectorIframe = selector({
    key: 'selectorIframe',
    get: ({ get }) => get(iframeState),
});
