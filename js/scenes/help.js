/**
 * HelpScene — 游戏帮助页面
 * 显示玩法说明、金币系统、角色成长等
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const HELP_LINES = [
  { text: '【游戏玩法】', bold: true },
  { text: '• 触发诈骗事件后判断风险等级', bold: false },
  { text: '• 安全 / 低风险 / 高风险 三种判断', bold: false },
  { text: '• 判断正确获得金币，错误扣除金币', bold: false },
  { text: '', bold: false },
  { text: '【通关条件】', bold: true },
  { text: '• 完成所有事件后金币 ≥ 0 即通关', bold: false },
  { text: '• 通关解锁新场景和角色等级', bold: false },
  { text: '', bold: false },
  { text: '【金币系统】', bold: true },
  { text: '• 判断成功奖励 50~150 金币', bold: false },
  { text: '• 可在商城购买道具', bold: false },
  { text: '', bold: false },
  { text: '【角色成长】', bold: true },
  { text: '• Lv1 校园新人 → Lv5 社会守护者', bold: false },
  { text: '• 提升等级解锁更多场景', bold: false },
  { text: '', bold: false },
  { text: '【提示】', bold: true },
  { text: '• 善用道具提高通关率', bold: false },
  { text: '• 连续正确有连击加分', bold: false },
];

class HelpScene {
  constructor(manager) {
    this.manager = manager;
    this.buttons = [];
  }

  _enter() {
    const w = SCREEN_WIDTH;
    // 返回按钮
    this.buttons = [
      {
        rect: { x: w / 2 - 80, y: this._calcBackY(), w: 160, h: 45 },
        handler: () => this.manager.switchTo('Start')
      }
    ];
  }

  _calcBackY() {
    const h = SCREEN_HEIGHT;
    const totalLines = HELP_LINES.filter(l => l.text).length;
    const contentH = totalLines * 28 + 40;
    return Math.min(h - 80, 100 + contentH + 20);
  }

  _exit() {
    this.buttons = [];
  }

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 背景
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // 标题
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(36, Math.floor(w * 0.048))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('游戏帮助', w / 2, 35);

    // 帮助内容
    let yPos = 75;
    HELP_LINES.forEach(line => {
      if (line.text === '') {
        yPos += 15;
        return;
      }
      ctx.fillStyle = line.bold ? '#D93A3A' : '#333333';
      ctx.font = line.bold
        ? `bold ${Math.min(22, Math.floor(w * 0.03))}px sans-serif`
        : `${Math.min(18, Math.floor(w * 0.024))}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.text, w * 0.08, yPos);
      yPos += 28;
    });

    // 返回按钮
    const backY = this._calcBackY();
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 80, backY, 160, 45, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('返回', w / 2, backY + 45 / 2);
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
}

export default HelpScene;
