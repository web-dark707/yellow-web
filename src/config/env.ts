/**
 * @description:  开发环境;
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * @description:  生产环境;
 */
export function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}
