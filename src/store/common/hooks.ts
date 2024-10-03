import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { dictState, hasOpenState, iframeState } from './atoms';
import { DictStateType, IframeStateType } from './types';

export const useSetDict = () => {
    const setValue = useSetRecoilState(dictState);
    return (state: DictStateType) => {
        setValue(state);
        setStorage('dict', state);
    };
};
export const useSetHasOpen = () => {
    const setValue = useSetRecoilState(hasOpenState);
    return (state: any) => {
        setValue(state);
        setStorage('hasOpen', state);
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
