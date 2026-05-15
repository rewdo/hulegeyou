/**
 * 《忽了个悠》微信小游戏主入口
 * 基于 Phaser.js v3 游戏引擎
 */

import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { HelpScene } from './scenes/HelpScene.js';

// 全局游戏数据（微信小游戏使用 GameGlobal）
GameGlobal.gameData = {
  userInfo: null,
  currentScene: null,
  currentLevel: 1,
  events: [],
  goldCoins: 2000,
  roleLevel: 1,
  props: [],
  unlockedScenes: ['校园权限场景', '社交福利场景']
};

// API 基础地址
GameGlobal.API_BASE = 'http://hulegeyou.yiouxiaozhan.top/api';

// 微信 request 请求封装
GameGlobal.request = function (options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.headers || { 'Content-Type': 'application/json' },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败：' + res.statusCode));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
};

// 弹窗提示封装（替代 alert，避免直接执行，需要时调用）
GameGlobal.showAlert = function (content, title) {
  return new Promise((resolve) => {
    wx.showModal({
      title: title || '提示',
      content: content || '',
      showCancel: false,
      success: function () {
        resolve();
      }
    });
  });
};

// 游戏配置
const config = {
  type: Phaser.WEBGL,
  width: 750,
  height: 1334,
  backgroundColor: '#F5F2E9',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    StartScene,
    LevelSelectScene,
    GameScene,
    ResultScene,
    ShopScene,
    HelpScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

// 启动游戏
const game = new Phaser.Game(config);

// 微信小游戏环境初始化
if (wx && wx.onShareAppMessage) {
  wx.onShareAppMessage(() => {
    return {
      title: '《忽了个悠》反诈闯关，测测你的防骗能力！',
      imageUrlId: '',
      imageUrl: ''
    };
  });
}

// 监听小程序切前台事件
if (wx && wx.onShow) {
  wx.onShow(function () {
    console.log('游戏回到前台');
  });
}

console.log('忽了个悠 游戏启动成功');
