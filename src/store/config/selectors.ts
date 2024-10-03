import { selector } from 'recoil';
import { configState } from './atoms';

export const selectorConfigState = selector({
    key: 'selectorConfigState',
    get: ({ get }) => {
        return get(configState);
    },
});
