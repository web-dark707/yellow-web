import { CommonList } from '../common/global';

export interface VideoListItem {
    content: string;
    cover: string;
    createTime: number;
    createUserId: string;
    createUserName: string;
    id: string;
    tag: string;
    type: number;
    updateTime: number;
    updateUserId: string;
    updateUserName: string;
    videoName: string;
    videoSize: number;
    videoUrl: string;
    vipLevel: number;
}

export type VideoListResult = CommonList<VideoListItem>;
