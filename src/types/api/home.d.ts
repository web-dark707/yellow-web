export interface DatingGirlsResult {
    id: number;
    name: string;
    code: number;
    age: number;
    height: number;
    weight: number;
    chest: number;
    physicalExamTime: string;
    physicalExamReport: string;
    tags: string;
    intro: string;
    validTimeslots: string;
    serviceItemInfos: {
        extraInfo: any;
        girlId: string;
        id: string;
        name: string;
        oriPrice: number;
        promotionPrice: number;
    }[];
    pics: string;
}

export interface DatingGirlsParams {
    filters: {
        [key: string]: string;
    };
}

export interface DictResult {
    filterCondition: {
        conditionItems: {
            checkboxItems: {
                canSelect: boolean;
                checked: boolean;
                text: string;
                value: string;
            }[];
            text: string;
            value: string;
        }[];
    };
    csBot: string;
    usdtToPhpRate: number; //USDT 转换 PHP 汇率
    promotionStr: string; //活动文字内容
    mainPayTip: string;
    datingHours: string;
    defaultDatingHour: string;
    depositMoney: string;
    orderStatus: {
        [key: string]: string;
    };
    mainPayProcessDesc: string;
    mainDepositPayProcessDesc: string;
}

export interface MyCouponsResult {
    id: number;
    category: string;
    categoryDesc: string;
    conditionDesc: string;
    useCondition: string;
    money: number;
    expireTime: string;
    status: string;
}

export interface LastAddressResult {
    tel: string;
    tg: string;
    address: string;
}

export interface PreConfirmDatingParams {
    girlId: number; //女生ID;
    couponId: number; // 優惠卷ID;
    serviceItemIds: string[]; //服务项ID;
    timeslot: string; //档期时间;
    hour: string;
    //联系地址
    addressInfo: {
        tel: string;
        tg: string;
        address: string;
    };
}
export interface PreConfirmDatingResult {
    datingId: number;
    girlName: string;
    serviceItems: string[];
    timeslot: string;
    hour: string;
    addressInfo: {
        tel: string;
        tg: string;
        address: string;
    };
    paymentInfo: {
        paymentMethod: string;
        address: string;
        amount: number;
        rate: number;
        paymentPrivilege: string;
    };
}
