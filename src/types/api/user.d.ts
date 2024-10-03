export interface UserLoginResult {
    member_name: string;
    name: string;
    member_code: string;
    token: string;
    parent_code: string;
    hall: number;
    hall_name: string;
    agent: string;
    create_time: number;
    r: string;
}

export interface UserInfoResult {
    member_name: string;
    name: string;
    member_code: string;
    token: string;
    parent_code: string;
    hall: number;
    hall_name: string;
    agent: string;
    create_time: number;
    r: string;
    pass_state: number;
    allow_a_reserve: number;
    allow_b_reserve: number;
    allow_m_reserve: number;
    allow_pay_password: number; // 是否允许修改支付密码: 1允许 2不允许
    err_num: number;
    member_type: number;
    message_switch: number; // 是否允许接收短信消息
    opt_switch: number; // 是否开启google验证码
    is_bind_opt: number; // 1已绑定 2未绑定
    is_open_opt: number;
    xing_num: number;
    continuous_num: number;
    is_qian_dao: boolean;
    qian_dao_info: {
        now_jiangli: {
            xing_bi: number;
            num: number;
        };
        next_jiangli: {
            xing_bi: number;
            num: number;
        };
    };
    vip_grade: string;
    xing_expired_time: number;
}

export interface UserInfo {
    code: string;
    activationCode: string;
    customerLevel: string;
    username: string;
    subActivationCode: Array<SubActivationCode>;
}
interface SubActivationCode {
    code: string;
    invitationCopyContent: string;
    invitationWords: string;
    upperOwner: string;
    username: string;
}
