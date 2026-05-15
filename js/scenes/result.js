/**
 * ResultScene — 关卡结果
 * 显示成功/失败、统计数据、操作按钮
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import api from '../api';

class ResultScene {
  constructor(manager) {
    this.manager = manager;
    this.buttons = [];
  }

  _enter(data) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    this.isPass = data.isPass || false;
    this.successCount = data.successCount || 0;
    this.failCount = data.failCount || 0;
    this.goldCoins = data.goldCoins || 0;
    this.maxCombo = data.maxCombo || 0;

    this.buttons = [
      // 主按钮（通关=返回关卡选择，失败=再来一次）
      {
        rect: { x: w / 2 - 120, y: h * 0.60, w: 240, h: 55 },
        handler: () => this._onMainAction()
      },
      // 返回首页
      {
        rect: { x: w / 2 - 100, y: h * 0.75, w: 200, h: 45 },
        handler: () => this.manager.switchTo('Start')
      }
    ];

    if (!this.isPass) {
      // 分享助力按钮
      this.buttons.push({
        rect: { x: w / 2 - 100, y: h * 0.68, w: 200, h: 45 },
        handler: () => this._shareForHelp()
      });
    }
  }

  _exit() {
    this.buttons = [];
  }

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 背景
    ctx.fillStyle = this.isPass ? '#E8F5E9' : '#FFEBEE';
    ctx.fillRect(0, 0, w, h);

    // 结果图标
    const iconY = h * 0.25;
    if (this.isPass) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = `${Math.min(60, Math.floor(w * 0.08))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎉', w / 2, iconY);
    } else {
      ctx.fillStyle = '#F44336';
      ctx.font = `${Math.min(60, Math.floor(w * 0.08))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('😢', w / 2, iconY);
    }

    // 结果文字
    ctx.fillStyle = this.isPass ? '#4CAF50' : '#F44336';
    ctx.font = `bold ${Math.min(40, Math.floor(w * 0.053))}px sans-serif`;
    ctx.fillText(this.isPass ? '闯关成功！' : '闯关失败', w / 2, iconY + 60);

    // 统计数据
    const stats = [
      `成功识别：${this.successCount} 个`,
      `失败识别：${this.failCount} 个`,
      `当前金币：💰 ${this.goldCoins}`,
      `最高连击：🔥 ${this.maxCombo}`
    ];

    ctx.fillStyle = '#333333';
    ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    let sy = iconY + 120;
    stats.forEach(stat => {
      ctx.fillText(stat, w / 2, sy);
      sy += 35;
    });

    // ── 按钮 ──
    ctx.textBaseline = 'middle';
    this.buttons.forEach(btn => {
      const r = btn.rect;
      ctx.fillStyle = '#D93A3A';
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(btn.label || '确定', r.x + r.w / 2, r.y + r.h / 2);
    });

    // 更新按钮文字
    // 使用 this._label 因为在 _enter 里设置了 buttons
  }

  _renderButtons(ctx, w) {
    this.buttons.forEach(btn => {
      const r = btn.rect;
      ctx.fillStyle = '#D93A3A';
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label || '确定', r.x + r.w / 2, r.y + r.h / 2);
    });
  }

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

  _onMainAction() {
    if (this.isPass) {
      this.manager.switchTo('LevelSelect');
    } else {
      // 重试当前关卡
      this.manager.switchTo('Game', {
        sceneType: GameGlobal.databus.currentScene,
        events: GameGlobal.databus.events
      });
    }
  }

  async _shareForHelp() {
    try {
      const result = await api.createShare(GameGlobal.databus.userInfo.openid, 1);
      if (result.code === 200) {
        GameGlobal.showAlert('分享功能已开启！');
      }
    } catch (err) {
      console.warn('Share error:', err);
    }
  }
}

export default ResultScene;
