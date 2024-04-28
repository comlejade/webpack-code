const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebapckPlugin = require('html-webpack-plugin')

module.exports = {
  //1. 入口 entry
  entry: "./src/main.js",
  //2. 输出 output
  output: {
    // 所有文件的输出路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"),
    // 入口文件打包输出的文件名
    filename: "static/js/main.js",
    // 在打包前，将path整个目录内容清空
    clean: true,
  },
  //3. loader
  module: {
    rules: [
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
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },
  //4. plugin
  plugins: [
    new ESLintPlugin({
      //检测哪些文件
      context: path.resolve(__dirname, '../src')
    }), 
    new HtmlWebapckPlugin({
      // 模板
      // 新的html文件特检： 1. 结构和原来一样，2. 自动引入打包后的js文件
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  //5. mode
  mode: "production",
};
