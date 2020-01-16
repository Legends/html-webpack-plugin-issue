// Many different loaders here: https://github.com/webpack-contrib/awesome-webpack#loaders

const path = require('path');
const { basename } = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const { GenerateSW } = require('workbox-webpack-plugin');

const pwaManifest = require('./src/js/manifest.webmanifest').pwaManifest;

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.scss', '.css', '.png', '.svg', '.jpg', '.gif', 'mjs', '.js', '.json','.html']
    },
    watchOptions: {
        ignored: /node_modules/,
        // poll: 1000 // If watching does not work for you, try out this option --> Check for changes every second
    },
    devtool: 'source-map', // any "source-map"-like devtool is possible
    entry: {
        index: './src/pages/index/',
        about: './src/pages/about/'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: 'chunkFilename.[name].bundle.js'
    },
    plugins: [

        new CleanWebpackPlugin({ verbose: true }),
        new CopyWebpackPlugin([
            { from: './src/js/p-cache.js', to: 'p-cache.js' },
        ]),
        new HtmlWebpackPlugin({
            template: './src/pages/layout/layout.ejs',
            templateParameters: {
                'title': 'Index-Page'
            }, 
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/layout/layout.ejs',
        templateParameters: {
            'title': 'YourTitleGoesHere'
        }, 
            inject: true,
            chunks: ['about'],
            filename: 'about.html'
        }),
        // new FaviconsWebpackPlugin({ logo: './src/img/logo.png' }), // , mode: "webapp" 
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        pwaManifest,
        // new BundleAnalyzerPlugin(),
        // new GenerateSW({
        //     // importWorkboxFrom: 'cdn',
        //     swDest: 'sw.js',
        //     clientsClaim: true,
        //     skipWaiting: true,
        // }) // generates a Service-Worker for offline app use
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        attrs: ['img:src', 'script:src', 'img:data-src', 'link:href'],
                        minimize: false,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // use .babelrc to customize browser support
                        plugins: ['@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-classes'
                        ]
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            // { test: /\.png$/, use: ["url-loader?mimetype=image/png"] },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },  //'style-loader',
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    { loader: 'postcss-loader' },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            sassOptions: { outputStyle: 'compressed' }
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    // fallback to style-loader in development
                    // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // only enable hot in development
                            hmr: process.env.NODE_ENV === 'development',
                            // if hmr does not work, this is a forceful method.
                            //reloadAll: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        }
                    }
                ]
            }
        ],
    },
};