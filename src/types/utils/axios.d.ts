export interface RequestOptions {
    // 网址前缀 留空使用默认
    urlPrefix?: string;
    // 设置token
    specialToken?: string;
    // 自定义请求报错提示
    errorMessage?: string;
    // 是否携带token
    withToken?: boolean;
}
