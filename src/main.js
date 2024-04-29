import count from "./js/count";
import sum from "./js/sum";

// 按需加载

import "./css/index.css";
import "./less/index.less";
import "./scss/inde.scss";
import "./stylus/index.styl";
import "./css/iconfont.css";

const result = count(2, 1);

console.log(result);
console.log(sum(1, 2, 3, 4));

document.getElementById('btn').addEventListener('click', function() {
    import(/* webpackChunkName: "match" */'./js/math.js')
    .then(res => {
        console.log('模块加载成功', res.default(2,3))
    }).catch(err => {
        console.log('模块加载失败', err)
    })
})

new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, 1000)
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }


if (module.hot) {
    // 是否支持热模块替换
    module.hot.accept('./js/count')
    module.hot.accept('./js/sum')
}