import { atom } from 'recoil';
import { getStorage } from '@/utils/storage';
import { TokenInfo } from '@/types/api/login';
import { UserDetail } from '@/types/api/home';

// 登录信息
export const tokenInfoState = atom<TokenInfo>({
    key: 'tokenInfoState',
    default: getStorage('tokenInfoState') ?? null,
});

// 用户信息
export const userDetailState = atom<UserDetail>({
    key: 'userDetailState',
    default: null,
});
