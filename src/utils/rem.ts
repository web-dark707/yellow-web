//基准大小
const baseSize = 16;

//设置 rem 函数
function setRem() {
    //当前页面宽度相对于1920宽的缩放比例, 可根据自己需要修改
    const scale = document.documentElement.clientWidth / 375;
    //设置页面根节点字体大小, 字体大小最小为12
    const fontSize =
        baseSize * Math.min(scale, 2) > 12 ? baseSize * Math.min(scale, 2) : 12;
    document.documentElement.style.fontSize = fontSize + 'px';
}

//初始化
setRem();
//改变窗口大小重新设置rem
window.onresize = function () {
    setRem();
};
