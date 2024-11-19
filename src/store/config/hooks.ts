import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import {
    configState,
    currentPageState,
    searchState,
    videoCategoryState,
} from './atoms';
import { ConfigType, SearchType, VideoCategoryType } from './types';

export const useSetConfig = () => {
    const setValue = useSetRecoilState(configState);
    return (value: Optional<ConfigType>) => {
        setValue((prevConfig) => {
            const updatedConfig = {
                ...prevConfig,
                ...value,
            };
            setStorage('config', updatedConfig);
            return updatedConfig;
        });
    };
};

export const useSetSearchStateState = () => {
    const setValue = useSetRecoilState(searchState);
    return (state: SearchType) => {
        setValue(state);
        return state;
    };
};

export const useSetVideoCategoryState = () => {
    const setValue = useSetRecoilState(videoCategoryState);
    return (state: VideoCategoryType[]) => {
        setValue(state);
        return state;
    };
};

export const useCurrentPageState = () => {
    const setValue = useSetRecoilState(currentPageState);
    return (state: number) => {
        setValue(state);
        return state;
    };
};
