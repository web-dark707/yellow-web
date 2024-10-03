import { DisputeType, PaymentType } from '@/enums/record';

// export const orderStatus = [
//     {
//         value: StatusType.NORMAL,
//         label: '正常',
//     },
//     {
//         value: StatusType.DISABLE,
//         label: '禁用',
//     },
//     {
//         value: StatusType.USED,
//         label: '已使用',
//     },
//     {
//         value: StatusType.WAIT_RECEIVE_DEPOSIT_MONEY,
//         label: '待支付訂金',
//     },
//     {
//         value: StatusType.WAIT_PLATFORM_ACK,
//         label: '待確定檔期',
//     },
//     {
//         value: StatusType.FINISH,
//         label: '已結束',
//     },
//     {
//         value: StatusType.WAIT_PAY,
//         label: '待支付尾款',
//     },
//     {
//         value: StatusType.NO_TIMESLOT,
//         label: '檔期衝突',
//     },
// ];

export const paymentStatus = [
    {
        value: PaymentType.NOT_PAY,
        label: '不可付款',
    },
    {
        value: PaymentType.PAID,
        label: '可付款',
    },
];

export const disputeStatus = [
    {
        value: DisputeType.NONE,
        label: '未完成',
    },
    {
        value: DisputeType.END,
        label: '已結束',
    },
    {
        value: DisputeType.ONGOING,
        label: '待平台确认',
    },
];
