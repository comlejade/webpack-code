const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebapckPlugin = require('html-webpack-plugin')
const os = require('os')

// cpu 核数
const threads = os.cpus().length

module.exports = {
  //1. 入口 entry
  // 相对路径
  entry: "./src/main.js",
  //2. 输出 output
  output: {
    // 开发模式没有输出
    // 所有文件的输出路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录
    path: undefined,
    // 入口文件打包输出的文件名
    filename: "js/main.js",
    // 在打包前，将path整个目录内容清空
    clean: true,
  },
  //3. loader
  module: {
    rules: [
      {
        // 每个文件只能被其中一个loader配置处理
        oneOf: [
          {
            test: /\.css$/,
            // 执行顺序 从右到左，从下到上
            // loader: 'xxx' 只能使用1个loader
            // use: ['xx', 'xx'] 可以使用多个loader
            use: [
              "style-loader", // 将js中css通过创建style标签添加html文件中生效
              "css-loader", // 将css资源变成成commonjs的模块到js中
            ],
          },
          {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.styl$/,
            use: ["style-loader", "css-loader", "stylus-loader"],
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
            generator: {
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            // include: path.resolve(__dirname, '../src'),  // 只处理src中的js文件
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
              },
            ]
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
      threads
    }), 
    new HtmlWebapckPlugin({
      // 模板
      // 新的html文件特检： 1. 结构和原来一样，2. 自动引入打包后的js文件
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  //5. mode
  mode: "development",
  // 不会输出资源，在内存中编译打包
  devServer: {
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true
  },
  // 只有行映射，没有列映射，打包编译快
  devtool: "cheap-module-source-map"
};
