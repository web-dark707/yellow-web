import { VideoParams } from '@/types/api/home';

export interface ConfigType {
    // 启动页状态
    initPageStatus: boolean;
}

export interface SearchType extends VideoParams {}
export interface VideoCategoryType {
    value: string;
    label: string;
}
