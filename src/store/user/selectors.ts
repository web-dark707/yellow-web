import { selector } from 'recoil';
import { userInfoState } from './atoms';

export const selectorUserInfo = selector({
    key: 'selectorUserInfo',
    get: ({ get }) => {
        return get(userInfoState);
    },
});
