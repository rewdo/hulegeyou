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
