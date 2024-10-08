import { usePollingVerify } from '@/common/polling_ws';

const PrivateRoute = (props: any) => {
    usePollingVerify();
    return props.element;
};

export default PrivateRoute;
