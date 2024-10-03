import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { configState } from './atoms';
import { ConfigType } from './types';

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
