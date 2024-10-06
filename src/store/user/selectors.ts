import { selector } from 'recoil';
import { tokenInfoState, userDetailState } from './atoms';

export const selectorTokenInfoState = selector({
    key: 'selectorTokenInfoState',
    get: ({ get }) => get(tokenInfoState),
});

export const selectorUserDetailState = selector({
    key: 'selectorUserDetailState',
    get: ({ get }) => get(userDetailState),
});
