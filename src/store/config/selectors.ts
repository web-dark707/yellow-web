import { selector } from 'recoil';
import {
    configState,
    currentPageState,
    searchState,
    videoCategoryState,
} from './atoms';

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

export const selectorCurrentPageState = selector({
    key: 'selectorCurrentPageState',
    get: ({ get }) => get(currentPageState),
});
