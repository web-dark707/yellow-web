import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { historySearchListState, iframeState } from './atoms';
import { IframeStateType } from './types';

export const useSetHistorySearchList = () => {
    const setValue = useSetRecoilState(historySearchListState);
    return (state: string[]) => {
        setValue(state);
        setStorage('historySearchListState', state);
    };
};

export const useSetIframe = () => {
    const setValue = useSetRecoilState(iframeState);
    return (state: Optional<IframeStateType>) => {
        setValue((prev) => ({
            ...prev,
            ...state,
        }));
    };
};
