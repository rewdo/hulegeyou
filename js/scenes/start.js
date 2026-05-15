/**
 * StartScene — 游戏主菜单
 * 显示标题、开始按钮、帮助按钮
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import api from '../api';

class StartScene {
  constructor(manager) {
    this.manager = manager;
    this.buttons = [];
  }

  _enter() {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 定义交互按钮区域 [{ rect, handler }]
    this.buttons = [
      {
        // 开始游戏按钮
        rect: {
          x: w / 2 - 120,
          y: h * 0.60,
          w: 240,
          h: 60
        },
        handler: () => this._onStart()
      },
      {
        // 帮助按钮
        rect: {
          x: w / 2 - 100,
          y: h * 0.72,
          w: 200,
          h: 50
        },
        handler: () => this.manager.switchTo('Help')
      }
    ];

    this.titleAlpha = 0;
    this.buttonsAlpha = 0;
    this.fadeInDone = false;
  }

  _exit() {
    this.buttons = [];
  }

  _update() {
    if (this.titleAlpha < 1) this.titleAlpha = Math.min(1, this.titleAlpha + 0.04);
    if (this.buttonsAlpha < 1) this.buttonsAlpha = Math.min(1, this.buttonsAlpha + 0.03);
    if (this.titleAlpha >= 1 && this.buttonsAlpha >= 1 && !this.fadeInDone) {
      this.fadeInDone = true;
    }
  }

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 背景
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // 装饰线（简笔画风格）
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.15);
    ctx.lineTo(w * 0.9, h * 0.15);
    ctx.stroke();

    // 标题
    ctx.save();
    ctx.globalAlpha = this.titleAlpha;
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(52, Math.floor(w * 0.07))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('忽了个悠', w / 2, h * 0.22);

    // 副标题
    ctx.fillStyle = '#666666';
    ctx.font = `${Math.min(26, Math.floor(w * 0.035))}px sans-serif`;
    ctx.fillText('反诈科普·寓教于乐', w / 2, h * 0.30);
    ctx.restore();

    // 角色简笔画
    ctx.save();
    ctx.globalAlpha = this.titleAlpha;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    // 圆形头像
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.42, 35, 0, Math.PI * 2);
    ctx.stroke();
    // 身体
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.42 + 35);
    ctx.lineTo(w / 2 - 20, h * 0.42 + 75);
    ctx.moveTo(w / 2, h * 0.42 + 35);
    ctx.lineTo(w / 2 + 20, h * 0.42 + 75);
    ctx.moveTo(w / 2 - 20, h * 0.42 + 75);
    ctx.lineTo(w / 2 + 20, h * 0.42 + 75);
    // 手臂
    ctx.moveTo(w / 2 - 20, h * 0.42 + 50);
    ctx.lineTo(w / 2 - 50, h * 0.42 + 40);
    ctx.moveTo(w / 2 + 20, h * 0.42 + 50);
    ctx.lineTo(w / 2 + 50, h * 0.42 + 40);
    ctx.stroke();
    ctx.restore();

    // 按钮
    ctx.save();
    ctx.globalAlpha = this.buttonsAlpha;

    // 开始按钮
    const btn1 = this.buttons[0].rect;
    ctx.fillStyle = '#D93A3A';
    ctx.beginPath();
    ctx.roundRect(btn1.x, btn1.y, btn1.w, btn1.h, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(30, Math.floor(w * 0.04))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开始游戏', btn1.x + btn1.w / 2, btn1.y + btn1.h / 2);

    // 帮助按钮
    const btn2 = this.buttons[1].rect;
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.roundRect(btn2.x, btn2.y, btn2.w, btn2.h, 12);
    ctx.fill();

    ctx.fillStyle = '#333333';
    ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.fillText('帮助', btn2.x + btn2.w / 2, btn2.y + btn2.h / 2);

    ctx.restore();

    // 底部文案
    ctx.fillStyle = '#999999';
    ctx.font = `${Math.min(16, Math.floor(w * 0.022))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('反诈科普·寓教于乐', w / 2, h - 30);
  }

  // ─── 触摸处理 ────────────────────────────────

  handleTouchStart(e) {
    const touch = e.touches[0];
    if (!touch) return;
    const tx = touch.clientX;
    const ty = touch.clientY;

    for (const btn of this.buttons) {
      const r = btn.rect;
      if (tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h) {
        btn.handler();
        break;
      }
    }
  }

  handleTouchMove() {}
  handleTouchEnd() {}

  // ─── 登录逻辑 ────────────────────────────────

  async _onStart() {
    try {
      const openid = 'test_user_' + Date.now();
      const result = await api.login(openid, '悠客');

      if (result.code === 200) {
        GameGlobal.databus.syncFromUser(result.data);
      } else {
        // 离线模式
        GameGlobal.databus.loadOffline();
      }
    } catch (err) {
      console.warn('Login failed, using offline:', err.message);
      GameGlobal.databus.loadOffline();
    }

    this.manager.switchTo('LevelSelect');
  }
}

export default StartScene;
