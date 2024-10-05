export interface PayParams {
    bankCode: string;
    amount: number;
    memberId: number;
    payType: number;
}

export interface PayResult {
    url: string;
}
