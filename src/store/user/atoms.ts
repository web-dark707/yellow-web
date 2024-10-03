import { atom } from 'recoil';
import { getStorage } from '@/utils/storage';
import { UserInfoType } from './types';

// 用户信息
export const userInfoState = atom<UserInfoType>({
    key: 'userInfoState',
    default: (getStorage('userInfo') || {}) as UserInfoType,
});
