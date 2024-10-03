import UserToken from '@/common/token';
import { usePollingVerify } from '@/common/polling_ws';

const PrivateRoute = (props: any) => {
    usePollingVerify();
    const token = UserToken.getToken();
    return props.element;
};

export default PrivateRoute;
