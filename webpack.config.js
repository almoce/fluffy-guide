const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: !process.env.WEBPACK_DEV_SERVER ? '[name].[contenthash:5].js' : '[name].js',
        chunkFilename: !process.env.WEBPACK_DEV_SERVER ? '[name].[contenthash:5].js' : '[name].js',
        publicPath: '',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: !process.env.WEBPACK_DEV_SERVER ? MiniCssExtractPlugin.loader : 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['postcss-preset-env']],
                            },
                        },
                    },
                    {
                        loader: 'stylus-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
    target: 'web',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:5].css',
            chunkFilename: '[name].[contenthash:5].css',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
        new webpack.DefinePlugin({
            'process.env.NODD_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new ESLintPlugin({
            extensions: ['.tsx', '.ts'],
        }),
    ],
}

if (process.env.WEBPACK_DEV_SERVER) {
    config.devServer = {
        hot: true,
        compress: true,
        historyApiFallback: true,
        // host: '0.0.0.0',
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'dist'),
        proxy: {
            '/api': {
                target: 'https://coffeexcx.migu.cn/test',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    }
}

module.exports = config
