import React, { FC, createContext, useContext } from 'react';
import NatsWrapper from '@/utils/nats';
// import authToken from '@/common/token';

const NatsContext = createContext<NatsWrapper>(null);

export const NatsProvider: FC<any> = ({ children }) => {
    const nats = NatsWrapper.getInstance();
    // const userToken = authToken.getToken() || '';

    // useEffect(() => {
    //     if (userToken) {
    //         nats.connect();
    //     }
    //     return () => {
    //         nats.close();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    return <NatsContext.Provider value={nats}>{children}</NatsContext.Provider>;
};

export const useNats = () => {
    const context = useContext(NatsContext);
    if (!context) {
        throw new Error('useNats must be used within a NatsProvider');
    }
    return context;
};
