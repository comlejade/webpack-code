const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebapckPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const os = require('os')
const TerserPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

// cpu 核数
const threads = os.cpus().length

function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader, // 将js中css通过创建style标签添加html文件中生效
    "css-loader", // 将css资源变成成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  //1. 入口 entry
  entry: "./src/main.js",
  //2. 输出 output
  output: {
    // 所有文件的输出路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出的文件名
    filename: "static/js/[name].[contenthash:8].js",
    // 给打包输出的其他文件命名
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    // 图片、字体等通过type:asset处理资源命名方式
    assetModuleFilename: 'static/medai/[hash:10][ext][query]',
    // 在打包前，将path整个目录内容清空
    clean: true,
  },
  //3. loader
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            // 执行顺序 从右到左，从下到上
            // loader: 'xxx' 只能使用1个loader
            // use: ['xx', 'xx'] 可以使用多个loader
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,
            use: getStyleLoader('less-loader'),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader('sass-loader'),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader('stylus-loader'),
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求数量
                // 缺点：体积会更大
                maxSize: 10 * 1024, // 10kb
              },
            },
            // 已经在上面统一处理
            // generator: {
            //   filename: "static/images/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",
            // 已经在上面统一处理
            // generator: {
            //   filename: "static/media/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                // 开始多进程打包
                loader: 'thread-loader',
                options: {
                  works: threads // 进程数量
                }
              },
              {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,   // 开始缓存
                cacheCompression: false // 关闭缓存压缩
              }
            }]
          }
        ]
      }
    ],
  },
  //4. plugin
  plugins: [
    new ESLintPlugin({
      //检测哪些文件
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache'),
      threads // 开启多进程
    }), 
    new HtmlWebapckPlugin({
      // 模板
      // 新的html文件特检： 1. 结构和原来一样，2. 自动引入打包后的js文件
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // 将css提取到单独的文件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  //5. mode
  mode: "production",
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserPlugin({
        parallel: threads,// 开启多进程
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 代码分割配置
    splitChunks: {
      chunks: 'all'
      // 其他用默认配置
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  // 包含行/列映射，打包慢
  devtool: "source-map"
};
