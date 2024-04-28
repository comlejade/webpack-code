import count from "./js/count";
import sum from "./js/sum";

import "./css/index.css";
import "./less/index.less";
import "./scss/inde.scss";
import "./stylus/index.styl";
import "./css/iconfont.css";

const result = count(2, 1);

console.log(result);
console.log(sum(1, 2, 3, 4));


if (module.hot) {
    // 是否支持热模块替换
    module.hot.accept('./js/count')
    module.hot.accept('./js/sum')
}