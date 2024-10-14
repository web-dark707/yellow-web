import { selector } from 'recoil';
import { configState, searchState, videoCategoryState } from './atoms';

export const selectorConfigState = selector({
    key: 'selectorConfigState',
    get: ({ get }) => {
        return get(configState);
    },
});

export const selectorSearchState = selector({
    key: 'selectorSearchState',
    get: ({ get }) => get(searchState),
});

export const selectorVideoCategoryState = selector({
    key: 'selectorVideoCategoryState',
    get: ({ get }) => get(videoCategoryState),
});
