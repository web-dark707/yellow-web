//轮询请求
import { useEffect } from 'react';
import Polling from '@/utils/polling';
import UserToken from '@/common/token';

export const polling = new Polling();

export const useGetDict = () => {
    return async () => {};
};

export const usePollingVerify = () => {
    const getDict = useGetDict();
    useEffect(() => {
        // 登录成功后轮询
        if (UserToken.getToken()) {
            polling.start(getDict);
            return () => {
                polling.stop();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
