// Many different loaders here: https://github.com/webpack-contrib/awesome-webpack#loaders

const path = require('path');
const { basename } = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const { GenerateSW } = require('workbox-webpack-plugin');

 

// const merge = require('webpack-merge');
// const devConfig = require('./webpack.config.dev.js')

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        index: './src/pages/index/',
        about: './src/pages/about/'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: 'chunkFilename.[name].bundle.js',
        // publicPath:'legends' //--> http.//localhost/legends
    },
    optimization: {
        minimize: true,
        // runtimeChunk: 'single',
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                defaultVendors: {
                    test: /\.js$/,
                    priority: -10,

                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin({ verbose: true }),        
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
        new FaviconsWebpackPlugin({ logo: './src/img/logo.png' }), // , mode: "webapp" 
        new MiniCssExtractPlugin({            
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),       
        new BundleAnalyzerPlugin(),
       
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
                        plugins: [
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'webfonts',
                            // publicPath: (url, resourcePath, context) => {
                            //     // `resourcePath` is original absolute path to asset
                            //     // `context` is directory where stored asset (`rootContext`) or `context` option

                            //     // To get relative path you can use
                            //     // const relativePath = path.relative(context, resourcePath);

                            //     // if (/my-custom-image\.png/.test(resourcePath)) {
                            //     //     return `other_public_path/${url}`;
                            //     // }
                            //     debugger;
                            //     console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                            //     console.log(url);
                            //     if (/webfonts/.test(context)) {
                            //         return `legends/${url}`;
                            //     }

                            //     return `public_path/${url}`;
                            // }
                        }
                    }
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    { loader: 'postcss-loader' },
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
                    {
                        loader: MiniCssExtractPlugin.loader
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

module.exports = config;