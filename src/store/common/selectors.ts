import { selector } from 'recoil';
import { historySearchListState } from './atoms';

export const selectorHistorySearchList = selector({
    key: 'selectorHistorySearchList',
    get: ({ get }) => get(historySearchListState),
});
