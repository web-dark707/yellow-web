export interface LoginParams {
    captcha: string;
    username: string;
    password: string;
}

export interface RegisterParams {
    captcha: string;
    username: string;
    password: string;
    invitationCode: string;
}

export interface LoginResult {
    tokenInfo: TokenInfo;
}

export interface TokenInfo {
    isLogin: boolean;
    loginDevice: string;
    loginId: string;
    loginType: string;
    sessionTimeout: number;
    tag: string;
    tokenActivityTimeout: number;
    tokenName: string;
    tokenSessionTimeout: number;
    tokenTimeout: number;
    tokenValue: string;
}
