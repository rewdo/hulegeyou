/**
 * BootScene — 启动加载场景
 * 显示「忽了个悠」标题 + 进度条，模拟加载后跳转到 StartScene
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import api from '../api';

class BootScene {
  constructor(manager) {
    this.manager = manager;
    this.progress = 0;
    this.targetProgress = 0;
    this.loadingText = '加载中...';
    this.finished = false;

    // 触摸监听——启动场景期间跳过
    this._touchHandler = null;
  }

  _enter() {
    this.progress = 0;
    this.targetProgress = 0;
    this.finished = false;

    // 模拟加载：5 步，每步间隔 400ms
    const steps = [
      { label: '初始化...', delta: 0.15 },
      { label: '加载资源...', delta: 0.30 },
      { label: '准备场景...', delta: 0.55 },
      { label: '加载完成', delta: 0.80 },
      { label: '准备就绪', delta: 1.00 },
    ];

    let idx = 0;
    const tick = () => {
      if (idx >= steps.length) {
        this.finished = true;
        this._timeout = setTimeout(() => {
          this.manager.switchTo('Start');
        }, 300);
        return;
      }
      const step = steps[idx++];
      this.loadingText = step.label;
      this.targetProgress = step.delta;
      this._timeout = setTimeout(tick, 350);
    };
    this._timeout = setTimeout(tick, 400);
  }

  _exit() {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
  }

  _update() {
    // 平滑进度
    if (this.progress < this.targetProgress) {
      this.progress = Math.min(
        this.targetProgress,
        this.progress + 0.04
      );
    }
  }

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 背景色
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // 标题
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(48, Math.floor(w * 0.064))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('忽了个悠', w / 2, h * 0.38);

    // 副标题
    ctx.fillStyle = '#666666';
    ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.fillText('反诈科普·寓教于乐', w / 2, h * 0.45);

    // 进度条背景
    const barW = Math.min(300, w * 0.7);
    const barH = 20;
    const barX = (w - barW) / 2;
    const barY = h * 0.55;
    ctx.fillStyle = '#CCCCCC';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 10);
    ctx.fill();

    // 进度条前景
    ctx.fillStyle = '#D93A3A';
    ctx.beginPath();
    ctx.roundRect(barX + 2, barY + 2, (barW - 4) * this.progress, barH - 4, 8);
    ctx.fill();

    // 加载文字
    ctx.fillStyle = '#333333';
    ctx.font = `${Math.min(18, Math.floor(w * 0.024))}px sans-serif`;
    ctx.textAlign = 'center';

    // 显示百分比（仅在非100%时显示）
    if (this.progress < 0.99) {
      ctx.fillText(`${Math.floor(this.progress * 100)}%`, w / 2, barY + barH + 30);
    } else {
      ctx.fillText('√ 加载完成', w / 2, barY + barH + 30);
    }
  }

  handleTouchStart() {}
  handleTouchMove() {}
  handleTouchEnd() {}
}

export default BootScene;
