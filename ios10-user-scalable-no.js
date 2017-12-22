/**
 * @file 针对 iOS 10 以上 user-scalable=no 失效的问题
 * @desc 参考：https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari#38573198
 * @author LeuisKen <leuisken@foxmail.com>
 */

// 双指放大
document.addEventListener('touchstart', function (e) {
    if (event.scale !== 1) {
        e.preventDefault();
    }
}, false);

// 双击屏幕
document.addEventListener('touchend', (function () {
    let lastTouchEnd = 0;
    return function (e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            // 这里会禁掉间隔时间小于 300 ms 的所有点击事件
            e.preventDefault();
            const target = e.target;
            // touchend 触发的 click
            // 会无视 button, input 等按钮标签上的disabled，照样触发 click
            // 所以这里手动加个判断
            if (shouldNotDispatchClick(target)) {
                return;
            }
            // 还要自己 new 一个。。。。
            target.dispatchEvent(new Event('click'));
        }
        lastTouchEnd = now;
    };
})(), false);

/**
 *
 * shouldNotDispatchClick
 *
 * @desc 判断该 html 元素，是否会在点击时执行点击事件
 * 对于带有 disabled 属性的 button 及 input type="button"元素，click 是不触发的
 * @param {HTMLElement} target 待判断的 html 元素
 * @return {boolean} 该元素是否应触发 click 事件
 */
function shouldNotDispatchClick(target) {
    if (target.disabled !== true) {
        return false;
    }
    if (target.tagName === 'BUTTON') {
        return true;
    }
    if (target.tagName === 'INPUT' && target.type === 'button') {
        return true;
    }
    return false;
}
