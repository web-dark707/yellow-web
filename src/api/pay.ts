import { PayParams, PayResult } from '@/types/api/pay';
import { deffHttp } from '@/utils/axios';

enum Api {
    PAY_GET_PAY = '/order/getPay',
}

export const getPay = (params: PayParams) =>
    deffHttp.post<PayResult>(
        { url: Api.PAY_GET_PAY, data: params },
        { withToken: false },
    );
