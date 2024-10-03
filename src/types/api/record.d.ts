import { StatusType } from '@/enums/record';
export enum PayType {
    POST_PAY = 'POST_PAY', //先享後付
    PRE_PAY = 'PRE_PAY', // 先付後享
}
export interface RecordResult {
    id: string;
    girlName: string;
    timeslot: string;
    hour: string;
    createdTime: string;
    status: StatusType;
    disputeStatus: string;
    disputeStatusDesc: string;
    tel: string;
    tg: string;
    address: string;
    totalPromotionPrice: number;
    discountPrice: number;
    realPayPrice: number;
    usdtPrice: number;
    usdtToPhpRate: number;
    receiveDepositExpireTime: string;
    paymentStatusDesc: string;
    usdtAddress: string;
    paidTime: string;
    paymentStatus: string;
    paidTransactionId: string;
    paidTransactionUrl: string;
    paymentPrivilege: PayType;
    serviceItems: {
        id: number;
        girlId: number;
        name: string;
        oriPrice: number;
        promotionPrice: number;
        extraInfo: string;
    }[];
    canPay: boolean;
    depositMoneyUsdt: number;
    receiveDepositTime: number;
    finalPayMoneyUsdt: number;
}

export interface RecordDisputeLogResult {
    content: string;
    createdBy: string;
    createdTime: number;
    datingRecordId: string;
    disputeOwner: string;
    id: string;
    status: string;
    updatedBy: string;
    updatedTime: number;
}
