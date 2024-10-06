import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { TokenInfo } from '@/types/api/login';
import { UserDetail } from '@/types/api/home';
import { tokenInfoState, userDetailState } from './atoms';

export const useSetTokenInfoState = () => {
    const setValue = useSetRecoilState(tokenInfoState);
    return (state: TokenInfo) => {
        setValue(state);
        setStorage('tokenInfoState', state);
        return state;
    };
};

export const useSetUserDetailState = () => {
    const setValue = useSetRecoilState(userDetailState);
    return (state: UserDetail) => {
        setValue(state);
        return state;
    };
};
