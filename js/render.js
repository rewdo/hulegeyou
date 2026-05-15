/**
 * Canvas 初始化
 * 创建全屏 canvas 并导出其尺寸
 */

const canvas = wx.createCanvas();
const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
const screenWidth = windowInfo.screenWidth;
const screenHeight = windowInfo.screenHeight;

canvas.width = screenWidth;
canvas.height = screenHeight;

export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;
export default canvas;

// roundRect polyfill（微信 canvas 不支持原生 roundRect）
var ctxProto = canvas.getContext('2d').constructor.prototype;
if (!ctxProto.roundRect) {
  ctxProto.roundRect = function(x, y, w, h, r) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
  };
}
