import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { historySearchListState } from './atoms';

export const useSetHistorySearchList = () => {
    const setValue = useSetRecoilState(historySearchListState);
    return (state: string[]) => {
        setValue(state);
        setStorage('historySearchListState', state);
    };
};
