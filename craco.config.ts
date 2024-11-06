const path = require('path');
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const sassResourcesLoader = require('craco-sass-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const CracoPluginScopedCss = require('craco-plugin-scoped-css');
const { GenerateSW } = require('workbox-webpack-plugin');

const resolve = (dir: string) => path.resolve(__dirname, dir);
const {
    REACT_APP_API_URL,
    NODE_ENV,
    REACT_APP_VIEWPORTWIDTH,
    REACT_APP_ENV = 'dev',
} = process.env;

module.exports = {
    style: {
        css: {
            loaderOptions: {
                sourceMap: false,
            },
        },
        postcss: {
            mode: 'extends',
            loaderOptions: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: [
                        [
                            'postcss-pxtorem',
                            {
                                unitToConvert: 'px', // 需要转换的单位，默认为"px"
                                viewportWidth: REACT_APP_VIEWPORTWIDTH, // 视窗的宽度，对应h5设计稿的宽度，一般是375
                                minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
                                rootValue: 16, // rem 相对于 px 转换的基准值
                                propList: ['*'], // 需要转换的 CSS 属性，* 表示全部
                                unitPrecision: 5, // 转换后的小数位数
                                exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
                            },
                        ],
                        ['autoprefixer'],
                        [
                            'postcss-custom-properties',
                            {
                                preserve: false,
                            },
                        ],
                    ],
                },
            },
        },
    },
    babel: {},
    webpack: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
            '@': resolve('src'),
        },
        plugins: {
            add: [
                new WindiCSSWebpackPlugin({
                    virtualModulePath: 'src',
                }),
                new WebpackBar({
                    profile: true,
                    name: 'webpack',
                    color: 'green',
                }),
            ],
        },
        configure: (webpackConfig: any, { env, paths }: any) => {
            // 修改build的生成文件名称
            paths.appBuild = REACT_APP_ENV;
            webpackConfig.output = {
                ...webpackConfig.output,
                path: resolve(REACT_APP_ENV),
                publicPath: '/',
                pathinfo: false,
            };
            // 添加worker-loader
            webpackConfig.module.rules?.[0]?.oneOf?.push({
                test: /\.worker\.ts$/,
                use: { loader: 'worker-loader' },
            });

            if (NODE_ENV === 'production') {
                webpackConfig.devtool = false;
                webpackConfig.plugins = webpackConfig.plugins.concat(
                    //开启Gzip
                    new CompressionPlugin({
                        algorithm: 'gzip',
                        threshold: 10240,
                        minRatio: 0.8,
                    }),
                    // PWA开启
                    new GenerateSW({
                        skipWaiting: true,
                        clientsClaim: true,
                        cleanupOutdatedCaches: true,
                        runtimeCaching: [],
                    }),
                );

                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    //开启代码分割
                    splitChunks: {
                        minSize: 30000,
                        maxSize: 50000,
                        minChunks: 1,
                        maxAsyncRequests: 5,
                        maxInitialRequests: 3,
                        automaticNameDelimiter: '~',
                        cacheGroups: {
                            vendors: {
                                test: /[\\/]node_modules[\\/]/,
                                priority: -10,
                                chunks: 'all',
                                name(module, chunks, cacheGroupKey) {
                                    const moduleFileName = module
                                        .identifier()
                                        .split('/')
                                        .reduceRight((item) => item);
                                    const allChunksNames = chunks
                                        .map((item) => item.name)
                                        .join('~');
                                    return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                                },
                            },
                            default: {
                                minChunks: 2,
                                priority: -20,
                                reuseExistingChunk: true,
                            },
                        },
                    },
                    runtimeChunk: {
                        name: (entrypoint) => `runtime-${entrypoint.name}`,
                    },
                };
            }

            return webpackConfig;
        },
    },
    plugins: [
        {
            plugin: sassResourcesLoader,
            options: {
                resources: './src/assets/scss/index.scss', //设置公共scss
            },
        },
        {
            plugin: CracoPluginScopedCss,
        },
    ],
    devServer: {
        port: 3000,
        hot: true,
        // https: true,
        client: {
            overlay: false, // 关闭错误弹窗
        },
        proxy: {
            context: ['/api', '/order', '/captcha'],
            target: REACT_APP_API_URL,
            logLevel: 'debug',
        },
    },
};
