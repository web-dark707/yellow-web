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

export interface VideoDetailsResult {
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
