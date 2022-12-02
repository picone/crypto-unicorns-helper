const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const resolve = p => path.resolve(__dirname, p)

module.exports = {
    mode: 'production',
    watch: true,
    watchOptions: {
        ignored: ["node_modules/**"],
	},
    devtool: 'cheap-module-source-map',
    entry: {
        content: resolve('src/content/content.js'),
        inject: resolve('src/content/inject.js'),
        background: resolve('src/background.js'),
        popup: resolve('src/popup/popup.js')
    },
    output: {
        filename: '[name].js',
        path: resolve('dist'),
        clean: true,
    },
    cache: {
        type: 'memory',
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.sass', '.jpg', '.png', '.html'],
        fallback: {
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css|sass)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
        ]
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
				terserOptions: {
					compress: { pure_funcs: ['console.log'] }
				}
			}),
			new OptimizeCssPlugin(),
        ],
        usedExports: true
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts'],
        }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }),
        new MiniCssExtractPlugin(),
        new VueLoaderPlugin(),
		new HtmlPlugin({
			title: 'Event List',
			filename: 'events.html',
			template: resolve('src/popup/events.html'),
			chunks: ['vendors', 'option'],
		}),
        new CopyPlugin({
			patterns: [
				{
					from: "manifest.json",
					to: "manifest.json",
				},
				{
					from: "imgs/icon.png",
					to: "imgs/icon.png",
				},
			],
		}),
    ],
}
