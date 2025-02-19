import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 3000;

/**
 * @description 封装的带重试机制的请求
 */
async function axiosWithRetry(
  config: AxiosRequestConfig,
  retryCount = 0,
): Promise<AxiosResponse> {
  try {
    return await axios(config);
  } catch (error) {
    if (retryCount < MAX_RETRY_COUNT) {
      console.log(
        `请求失败，正在重试... (${retryCount + 1}/${MAX_RETRY_COUNT})`,
      );
      await delay(RETRY_DELAY_MS);
      return axiosWithRetry(config, retryCount + 1);
    }
    console.error('请求多次失败:', error.message || error.response?.data);
    throw error;
  }
}

/**
 * @description 延迟函数
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { axiosWithRetry };
