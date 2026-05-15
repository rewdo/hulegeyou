/**
 * 忽了个悠 - 主入口
 *
 * 职责：
 * 1. 初始化 Canvas 和全局数据
 * 2. 注册所有场景
 * 3. 运行主渲染循环
 * 4. 全局触摸事件派发
 */

import canvas, { SCREEN_WIDTH, SCREEN_HEIGHT } from './render';
import DataBus from './databus';
import api, { request, API_BASE } from './api';
import BootScene from './scenes/boot';
import StartScene from './scenes/start';
import LevelSelectScene from './scenes/levelSelect';
import GameScene from './scenes/game';
import ResultScene from './scenes/result';
import ShopScene from './scenes/shop';
import HelpScene from './scenes/help';

// ─── 全局上下文 ────────────────────────────────────────────

const ctx = canvas.getContext('2d');

// GameGlobal 是微信小游戏提供的全局对象
GameGlobal.databus = new DataBus();
GameGlobal.API_BASE = API_BASE;
GameGlobal.request = request;
GameGlobal.api = api;

// 弹窗提示
GameGlobal.showAlert = function (content, title) {
  return new Promise((resolve) => {
    wx.showModal({
      title: title || '提示',
      content: content || '',
      showCancel: false,
      success: () => resolve()
    });
  });
};

// ─── 场景管理器 ─────────────────────────────────────────────

class SceneManager {
  constructor() {
    this.current = null;
    this.sceneDefs = {};
    this._touchHandler = null;
    this._animationId = 0;
  }

  /** 注册场景类 */
  register(name, SceneClass) {
    this.sceneDefs[name] = SceneClass;
  }

  /** 切换到指定场景 */
  switchTo(name, data) {
    // 退出当前场景
    if (this.current && typeof this.current._exit === 'function') {
      this.current._exit();
    }

    const Cls = this.sceneDefs[name];
    if (!Cls) {
      console.error(`Scene "${name}" not registered`);
      return;
    }

    // 创建新场景实例
    this.current = new Cls(this);
    this.current._enter(data);
  }

  /** 启动游戏，自动进入 Boot 场景 */
  start() {
    // 注册场景
    this.register('Boot', BootScene);
    this.register('Start', StartScene);
    this.register('LevelSelect', LevelSelectScene);
    this.register('Game', GameScene);
    this.register('Result', ResultScene);
    this.register('Shop', ShopScene);
    this.register('Help', HelpScene);

    // 全局触摸事件（派发到当前场景）
    wx.onTouchStart((e) => {
      if (this.current && typeof this.current.handleTouchStart === 'function') {
        this.current.handleTouchStart(e);
      }
    });
    wx.onTouchMove((e) => {
      if (this.current && typeof this.current.handleTouchMove === 'function') {
        this.current.handleTouchMove(e);
      }
    });
    wx.onTouchEnd((e) => {
      if (this.current && typeof this.current.handleTouchEnd === 'function') {
        this.current.handleTouchEnd(e);
      }
    });

    // 进入 Boot 场景
    this.switchTo('Boot');
  }

  /** 帧循环 */
  loop() {
    // 清屏
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 更新 & 渲染当前场景
    if (this.current) {
      if (typeof this.current._update === 'function') {
        this.current._update();
      }
      if (typeof this.current._render === 'function') {
        this.current._render(ctx);
      }
    }

    this._animationId = requestAnimationFrame(() => this.loop());
  }

  /** 停止循环 */
  stop() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = 0;
    }
  }
}

// ─── 主类 ──────────────────────────────────────────────────

export default class App {
  constructor() {
    this.sceneManager = new SceneManager();

    // 登录信息初始化
    GameGlobal.databus.loadOffline();

    // 启动场景管理器 & 开始循环
    this.sceneManager.start();
    this.sceneManager.loop();
  }
}
