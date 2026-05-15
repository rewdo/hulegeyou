/**
 * LevelSelectScene — 关卡选择
 * 展示所有场景，已解锁的可点击进入，未解锁的显示锁图标
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import DataBus from '../databus';
import api from '../api';

const SCENE_LIST = [
  { id: '校园权限场景', name: '🏫 校园权限', level: 1, locked: false },
  { id: '社交福利场景', name: '💬 社交福利', level: 1, locked: false },
  { id: '校园兼职场景', name: '💼 校园兼职', level: 2, locked: true },
  { id: '二手交易场景', name: '🛍️ 二手交易', level: 2, locked: true },
  { id: '租房场景', name: '🏠 租房生活', level: 3, locked: true },
  { id: '消费维权场景', name: '⚖️ 消费维权', level: 3, locked: true },
  { id: '职场入职场景', name: '👔 职场入职', level: 4, locked: true },
  { id: '基础金融场景', name: '💰 基础金融', level: 4, locked: true },
  { id: '法律合同场景', name: '📜 法律合同', level: 5, locked: true },
  { id: '高端诈骗场景', name: '🎭 高端诈骗', level: 5, locked: true },
];

class LevelSelectScene {
  constructor(manager) {
    this.manager = manager;
    this.buttons = [];
    this.scrollY = 0;
  }

  _enter() {
    const db = GameGlobal.databus;
    this.buttons = [];

    // 更新锁定状态
    const scenes = SCENE_LIST.map(s => ({
      ...s,
      locked: s.level > db.roleLevel
    }));

    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    let yPos = h * 0.25;
    const itemH = 75;
    const gap = 10;
    const totalH = yPos + scenes.length * (itemH + gap);

    scenes.forEach((scene, idx) => {
      const ry = yPos + idx * (itemH + gap);

      // 场景卡片本身（可点，但只有解锁的才跳转）
      const cardRect = {
        x: w * 0.08, y: ry, w: w * 0.84, h: itemH
      };

      // 开始闯关按钮（仅解锁）
      let btnRect = null;
      if (!scene.locked) {
        btnRect = {
          x: w * 0.68, y: ry + 15, w: w * 0.22, h: 40
        };
      }

      this.buttons.push({
        rect: cardRect,
        scene,
        btnRect,
        handler: () => {
          if (!scene.locked) this._startLevel(scene.id);
        }
      });

      yPos = ry + itemH + gap;
    });

    this.scenes = scenes;

    // 返回按钮
    this.buttons.push({
      rect: { x: 20, y: 20, w: 60, h: 50 },
      handler: () => this.manager.switchTo('Start')
    });

    // 商城按钮
    this.buttons.push({
      rect: { x: w - 140, y: 25, w: 120, h: 40 },
      handler: () => this.manager.switchTo('Shop')
    });
  }

  _exit() {
    this.buttons = [];
    this.scenes = [];
  }

  _update() {}

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;
    const db = GameGlobal.databus;

    // 背景
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // ── 顶部信息栏 ──
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, w, 80);

    // 金币
    ctx.font = `${Math.min(22, Math.floor(w * 0.03))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('💰 ' + db.goldCoins, 20, 40);

    // 等级
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Lv.' + db.roleLevel, w - 20, 40);

    // 商城文字
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD700';
    ctx.font = `${Math.min(18, Math.floor(w * 0.024))}px sans-serif`;
    ctx.fillText('商城', w - 60, 55);

    // ── 标题 ──
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(36, Math.floor(w * 0.048))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('选择关卡', w / 2, h * 0.12);

    // ── 场景列表 ──
    const itemH = 75;
    const gap = 10;

    this.scenes.forEach((scene, idx) => {
      const yPos = h * 0.25 + idx * (itemH + gap);

      // 卡片背景
      const cardX = w * 0.08;
      const cardW = w * 0.84;

      if (scene.locked) {
        ctx.fillStyle = '#E0E0E0';
        ctx.globalAlpha = 0.5;
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.roundRect(cardX, yPos, cardW, itemH, 10);
      ctx.fill();

      if (!scene.locked) {
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cardX, yPos, cardW, itemH, 10);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // 场景名称
      ctx.fillStyle = scene.locked ? '#999999' : '#333333';
      ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(scene.name, cardX + 15, yPos + itemH / 2);

      // 锁定 / 开始按钮
      if (scene.locked) {
        ctx.font = `${Math.min(18, Math.floor(w * 0.024))}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#999999';
        ctx.fillText('🔒 Lv.' + scene.level, cardX + cardW - 15, yPos + itemH / 2);
      } else {
        // 红色按钮
        const btnX = w * 0.68;
        const btnW = w * 0.22;
        ctx.fillStyle = '#D93A3A';
        ctx.beginPath();
        ctx.roundRect(btnX, yPos + 15, btnW, 40, 8);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.min(18, Math.floor(w * 0.024))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('开始闯关', btnX + btnW / 2, yPos + 15 + 20);
      }
    });
  }

  // ─── 触摸 ────────────────────────────────────

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

  async _startLevel(sceneType) {
    try {
      const db = GameGlobal.databus;
      const result = await api.startLevel(db.userInfo.openid, sceneType, 1);

      if (result.code === 200) {
        db.events = result.data.session.events;
        db.currentLevel = result.data.session.level;
        db.currentScene = sceneType;
        this.manager.switchTo('Game', { sceneType, events: result.data.session.events });
      } else {
        GameGlobal.showAlert('开始失败：' + result.message);
      }
    } catch (err) {
      console.error('Start level error:', err);
      GameGlobal.showAlert('网络错误，请重试');
    }
  }
}

export default LevelSelectScene;
