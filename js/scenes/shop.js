/**
 * ShopScene — 道具商城
 * 展示可购买道具列表
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import api from '../api';

const SHOP_PROPS = [
  { id: 'detector', name: '漏洞探测器', desc: '提示当前事件风险等级', price: 600 },
  { id: 'stopLoss', name: '止损卡', desc: '失败时减少 50% 惩罚', price: 400 },
  { id: 'revert', name: '撤销卡', desc: '撤销一次错误判断', price: 300 },
  { id: 'doubleGold', name: '双倍金币卡', desc: '本次金币奖励翻倍', price: 200 },
  { id: 'skip', name: '跳过卡', desc: '跳过当前事件', price: 150 },
  { id: 'hint', name: '提示卡', desc: '显示 50% 正确提示', price: 100 },
];

class ShopScene {
  constructor(manager) {
    this.manager = manager;
    this.buttons = [];
  }

  _enter() {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    this.buttons = [];

    SHOP_PROPS.forEach((prop, idx) => {
      const yPos = 140 + idx * 95;
      // 购买按钮
      this.buttons.push({
        rect: { x: w * 0.78, y: yPos + 15, w: w * 0.15, h: 44 },
        handler: () => this._buyProp(prop)
      });
    });

    // 看广告按钮
    this.buttons.push({
      rect: { x: w / 2 - 120, y: h - 150, w: 240, h: 50 },
      handler: () => this._watchAd()
    });

    // 返回按钮
    this.buttons.push({
      rect: { x: 20, y: 20, w: 100, h: 50 },
      handler: () => this.manager.switchTo('LevelSelect')
    });
  }

  _exit() {
    this.buttons = [];
  }

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;
    const db = GameGlobal.databus;

    // 背景
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // 标题
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(36, Math.floor(w * 0.048))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('道具商城', w / 2, 45);

    // 金币显示
    ctx.textAlign = 'right';
    ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.fillStyle = '#FFD700';
    ctx.fillText('💰 ' + db.goldCoins, w - 20, 45);

    // 道具列表
    SHOP_PROPS.forEach((prop, idx) => {
      const yPos = 140 + idx * 95;

      // 卡片背景
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(w * 0.05, yPos, w * 0.9, 80, 10);
      ctx.fill();
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(w * 0.05, yPos, w * 0.9, 80, 10);
      ctx.stroke();

      // 名称
      ctx.fillStyle = '#333333';
      ctx.font = `bold ${Math.min(22, Math.floor(w * 0.03))}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(prop.name, w * 0.08, yPos + 28);

      // 描述
      ctx.fillStyle = '#666666';
      ctx.font = `${Math.min(16, Math.floor(w * 0.022))}px sans-serif`;
      ctx.fillText(prop.desc, w * 0.08, yPos + 55);

      // 价格
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
      ctx.fillText('💰 ' + prop.price, w * 0.72, yPos + 38);

      // 购买按钮
      const canBuy = db.goldCoins >= prop.price;
      ctx.fillStyle = canBuy ? '#D93A3A' : '#CCCCCC';
      ctx.beginPath();
      ctx.roundRect(w * 0.78, yPos + 18, w * 0.15, 44, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('购买', w * 0.78 + w * 0.15 / 2, yPos + 40);
    });

    // 广告按钮
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 120, h - 150, 240, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.fillText('📺 观看广告赚金币', w / 2, h - 125);

    // 返回文字
    ctx.fillStyle = '#333333';
    ctx.font = `${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('← 返回', 30, 45);
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

  async _buyProp(prop) {
    const db = GameGlobal.databus;
    if (db.goldCoins < prop.price) {
      GameGlobal.showAlert('金币不足！');
      return;
    }

    try {
      const result = await api.buyProp(db.userInfo.openid, prop.id);
      if (result.code === 200) {
        db.goldCoins = result.data.newGold;
        db.props = result.data.props;
        GameGlobal.showAlert('购买成功！剩余金币：' + result.data.newGold);
        // 刷新场景
        this._enter();
      } else {
        GameGlobal.showAlert('购买失败：' + result.message);
      }
    } catch (err) {
      console.error('Buy error:', err);
      GameGlobal.showAlert('网络错误，请重试');
    }
  }

  async _watchAd() {
    GameGlobal.showAlert('广告观看成功！获得 50 金币（模拟）');
    GameGlobal.databus.goldCoins += 50;
    this._enter();
  }
}

export default ShopScene;
