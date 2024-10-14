import { CommonList, PageParams } from '../common/global';

export interface VideoListItem {
    anchorId: string;
    chargeType: number;
    clipUrl: string;
    content: string;
    cover: string;
    createTime: number;
    createUserName: string;
    duration: string;
    id: string;
    name: string;
    price: number;
    size: number;
    snapshot: string;
    tag: string;
    type: number;
    updateTime: number;
    updateUserName: string;
}

export type VideoListResult = CommonList<VideoListItem>;

export interface VideoDetailsItem {
    anchorId: string;
    chargeType: number;
    clipUrl: string;
    content: string;
    cover: string;
    createTime: number;
    createUserName: string;
    duration: string;
    id: string;
    name: string;
    price: number;
    size: number;
    snapshot: string;
    tag: string;
    type: number;
    updateTime: number;
    updateUserName: string;
    createUserId: string;
    updateUserId: string;
    url: string;
}

export interface VideoDetailsResult {
    record: VideoDetailsItem;
}

export interface UserResult {
    record: UserDetail;
}

export interface UserDetail {
    posName: string;
    depName: string;
    isVip: number;
    posId: string;
    password: string;
    balance: number;
    nickname: string;
    depId: number;
    id: string;
    invitationCode: string;
    invitationCodeBy: string;
    username: string;
}

export interface VideoParams extends PageParams {
    anchorId?: string;
    orderByColumn?: string;
    orderType?: string;
    type?: number;
    name?: string;
}

export interface AnchorListParams {
    name?: string;
    tag?: string;
}

export type AnchorListResult = CommonList<AnchorListItem>;

export interface AnchorListItem {
    age: number;
    content: string;
    cover: string;
    id: string;
    name: string;
    seriesVideoPrice: number;
    tag: string;
}

export interface AnchorDetail {
    record: {
        age: number;
        content: string;
        cover: string;
        id: string;
        invitationCode: string;
        name: string;
        seriesVideoPrice: number;
        tag: string;
    };
}

export interface DictListParams {
    dictType: string;
}

export type DictResult = CommonList<DictListItem>;

export interface DictListItem {
    createBy: string;
    createTime: number;
    cssClass: string;
    dictLabel: string;
    dictSort: 1;
    dictType: string;
    dictValue: string;
    id: string;
    isDefault: string;
    listClass: string;
    remark: string;
    status: string;
    updateBy: string;
    updateTime: number;
}
