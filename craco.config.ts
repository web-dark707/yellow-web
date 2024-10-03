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
    REACT_APP_OFFICIAL_API_URL,
    REACT_APP_WS_URL,
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
                            'postcss-px-to-viewport-8-plugin',
                            {
                                unitToConvert: 'px', // 需要转换的单位，默认为"px"
                                viewportWidth: REACT_APP_VIEWPORTWIDTH, // 视窗的宽度，对应h5设计稿的宽度，一般是375
                                // viewportHeight: 667,// 视窗的高度，对应的是我们设计稿的高度
                                unitPrecision: 3, // 单位转换后保留的精度
                                propList: [
                                    // 能转化为vw的属性列表
                                    '*',
                                ],
                                viewportUnit: 'vw', // 希望使用的视口单位
                                fontViewportUnit: 'vw', // 字体使用的视口单位
                                selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。cretae
                                minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
                                mediaQuery: false, // 媒体查询里的单位是否需要转换单位
                                replace: true, // 是否直接更换属性值，而不添加备用属性
                                // exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
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
            paths.appBuild = 'dist';
            webpackConfig.output = {
                ...webpackConfig.output,
                path: resolve('dist'),
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
            '/api': {
                target: REACT_APP_API_URL,
                changeOrigin: true,
                logLevel: 'debug',
                headers: {
                    Cookie: '',
                },
            },
        },
    },
};
