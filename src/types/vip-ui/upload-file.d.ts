export interface UploadFileProps {
    /**
     * 最大上传数 默认8
     */
    max?: number;
    /**
     * 是否多选
     */
    multiple?: boolean;
    /**
     * 是否直接上传 设置为true时，直接调用onChange事件返回
     */
    isDirectUploads?: boolean;
    /**
     * 是否压缩图片
     */
    isCompressedImages?: boolean;
    /**
     * 是否自动上传
     */
    isAutomation?: boolean;
    /**
     * 返回上传图片后的地址数组
     */
    onChange?: (list: string[]) => void;
}

export interface UploadFileRef {
    /**
     * 获取所有图片url
     */
    getImagesUrl: () => Promise<any[]>;
}
