/**
 * @description: token设置
 */
import { TokenInfo } from '@/types/api/login';
import { setStorage, getStorage, removeStorage } from '@/utils/storage';

const tokenInfoState = getStorage('tokenInfoState');

export default Object.freeze({
    clearToken: () => {
        if (tokenInfoState) {
            removeStorage((tokenInfoState as TokenInfo).tokenName);
        }
    },

    setToken: (key: string, data: string) => {
        setStorage(key, data);
    },

    getToken: () => {
        if (tokenInfoState) {
            return getStorage((tokenInfoState as TokenInfo).tokenName);
        }
    },
    getTokenName: () => {
        if (tokenInfoState) {
            return (tokenInfoState as TokenInfo).tokenName;
        }
    },
});
