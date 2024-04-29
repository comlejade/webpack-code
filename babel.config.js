module.exports = {
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: 'usage',   // 按需加载
            corejs: 3
        }]
    ],
    plugins: ['@babel/plugin-transform-runtime']
}