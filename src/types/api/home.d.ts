import { CommonList } from '../common/global';

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
