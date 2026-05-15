/**
 * GameScene — 核心游戏场景
 *
 * 功能：
 * - 反诈事件对话弹窗
 * - 风险判断（安全/低风险/高风险）
 * - 计时器（30s 限时）
 * - 连击系统
 * - 道具系统
 * - 风险闪光动画
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import api from '../api';

class GameScene {
  constructor(manager) {
    this.manager = manager;
  }

  _enter(data) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    this.sceneType = data.sceneType;
    this.events = data.events || [];
    this.currentEventIndex = 0;
    this.goldCoins = GameGlobal.databus.goldCoins;
    this.startGold = this.goldCoins;
    this.successCount = 0;
    this.failCount = 0;

    // 连击
    this.comboCount = 0;
    this.maxCombo = 0;

    // 计时
    this.timeLeft = 30;
    this.isTimerRunning = false;
    this.timerAccum = 0; // ms 累加

    // 道具
    this.userProps = GameGlobal.databus.props || [];
    this.doubleGoldActive = false;
    this.hintUsedForCurrent = false;

    // 对话状态
    this.currentEvent = null;
    this.dialogActive = false;
    this.dialogElements = []; // { type, ... }
    this.resultActive = false;
    this.resultElements = [];
    this.animations = []; // 临时动画

    // 触发计时：延迟 1s 后显示第一个事件
    this._triggerTimer = setTimeout(() => {
      this._triggerEvent();
    }, 1000);
  }

  _exit() {
    if (this._triggerTimer) clearTimeout(this._triggerTimer);
    clearTimeout(this._resultTimer);
    clearTimeout(this._nextTimer);
    this.dialogActive = false;
    this.resultActive = false;
    this.animations = [];
    this.dialogElements = [];
    this.resultElements = [];
  }

  // ─── 更新 (每帧) ─────────────────────────────

  _update() {
    if (this.isTimerRunning) {
      // 每秒减 1
      this.timerAccum += 16; // ~16ms per frame at 60fps
      if (this.timerAccum >= 1000) {
        this.timerAccum -= 1000;
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this._handleTimeUp();
        }
      }
    }
  }

  // ─── 渲染 (每帧) ─────────────────────────────

  _render(ctx) {
    const w = SCREEN_WIDTH;
    const h = SCREEN_HEIGHT;

    // 背景
    ctx.fillStyle = '#F5F2E9';
    ctx.fillRect(0, 0, w, h);

    // 场景装饰框
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(20, 90, w - 40, h - 190);
    ctx.setLineDash([]);

    // ── 顶部栏 ──
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, w, 80);

    // 金币
    ctx.fillStyle = '#FFD700';
    ctx.font = `${Math.min(22, Math.floor(w * 0.03))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('💰 ' + this.goldCoins, 15, 20);

    // 进度
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = `${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
    ctx.fillText(`事件：${this.currentEventIndex}/${this.events.length}`, w / 2, 18);

    // 场景名
    ctx.textAlign = 'right';
    ctx.fillStyle = '#AAAAAA';
    ctx.font = `${Math.min(16, Math.floor(w * 0.022))}px sans-serif`;
    ctx.fillText(this.sceneType || '', w - 15, 18);

    // 连击
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF6B35';
    ctx.font = `bold ${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
    ctx.fillText(this.comboCount >= 2 ? '🔥 连击 x' + this.comboCount : '', w / 2, 50);

    // 计时条
    const barX = w * 0.08;
    const barW = w * 0.84;
    const barY = 72;
    const ratio = Math.max(0, this.timeLeft / 30);
    // 背景
    ctx.fillStyle = '#555555';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 6, 3);
    ctx.fill();
    // 前景
    let barColor = '#4CAF50';
    if (this.timeLeft <= 10) barColor = '#F44336';
    else if (this.timeLeft <= 20) barColor = '#FF9800';
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * ratio, 6, 3);
    ctx.fill();

    // 计时文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.min(14, Math.floor(w * 0.019))}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(this.timeLeft + 's', barX + barW, barY + 6 + 16);

    // ── 提示文字 ──
    ctx.fillStyle = '#666666';
    ctx.font = `${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('移动角色触发事件', w / 2, h - 30);

    // ── 角色（固定 + 可触发的 event point） ──
    this._drawCharacter(ctx, w, h);

    // ── 对话弹窗 ──
    if (this.dialogActive) {
      this._drawDialog(ctx, w, h);
    }

    // ── 结果弹窗 ──
    if (this.resultActive) {
      this._drawResult(ctx, w, h);
    }

    // ── 动画层 ──
    this._drawAnimations(ctx, w, h);
  }

  // ─── 渲染辅助 ─────────────────────────────────

  _drawCharacter(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(cx - 15, cy + 28, 30, 40);

    // event point 标记
    if (this.events.length > 0 && !this.dialogActive && !this.resultActive) {
      ctx.fillStyle = '#D93A3A';
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() / 300);
      ctx.beginPath();
      ctx.arc(cx + 60, cy - 60, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', cx + 60, cy - 54);
    }
  }

  _drawDialog(ctx, w, h) {
    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    // 对话窗背景
    const dx = w * 0.08;
    const dy = h * 0.15;
    const dw = w * 0.84;
    const dh = h * 0.60;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(dx, dy, dw, dh, 15);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(dx, dy, dw, dh, 15);
    ctx.stroke();

    // 标题
    ctx.fillStyle = '#333333';
    ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(this.dialogTitle || '', dx + 20, dy + 30);

    // 内容
    ctx.fillStyle = '#666666';
    ctx.font = `${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
    this._wrapText(ctx, this.dialogContent || '', dx + 20, dy + 70, dw - 40, 32);

    // 投入金币提示
    let contentBottom = dy + 70;
    if (this.dialogContent) {
      const lines = Math.ceil(ctx.measureText(this.dialogContent).width / (dw - 40)) || 1;
      contentBottom += lines * 32 + 20;
    } else {
      contentBottom += 30;
    }

    if (this.costInvest > 0) {
      ctx.fillStyle = '#D93A3A';
      ctx.font = `bold ${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('💰 需投入：' + this.costInvest + '金币', w / 2, contentBottom);
      contentBottom += 30;
    }

    // 提示卡信息
    if (this.hintUsedForCurrent && this.hintTextStr) {
      ctx.fillStyle = '#2196F3';
      ctx.font = `${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('💡 ' + this.hintTextStr, w / 2, contentBottom);
      contentBottom += 30;
    }

    // 风险判断按钮（由 touch 处理，此处仅渲染）
    // 按钮坐标存储用于触摸检测
    const btnYBase = dy + dh - 60;
    const btnW = Math.min(140, w * 0.22);
    const btnH = 44;
    const gap = (dw - btnW * 3) / 4;

    this.dialogBtnRects = [
      { x: dx + gap, y: btnYBase, w: btnW, h: btnH, label: '✅ 安全', color: '#4CAF50' },
      { x: dx + gap * 2 + btnW, y: btnYBase, w: btnW, h: btnH, label: '⚠️ 低风险', color: '#FF9800' },
      { x: dx + gap * 3 + btnW * 2, y: btnYBase, w: btnW, h: btnH, label: '🚫 高风险', color: '#F44336' },
    ];

    this.dialogBtnRects.forEach(btn => {
      ctx.fillStyle = btn.color;
      ctx.beginPath();
      ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${Math.min(16, Math.floor(w * 0.022))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    });

    // 关闭按钮
    ctx.fillStyle = '#999999';
    ctx.font = `bold ${Math.min(28, Math.floor(w * 0.037))}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('✕', dx + dw - 10, dy + 25);
    this.closeBtnRect = { x: dx + dw - 50, y: dy, w: 50, h: 40 };
  }

  _drawResult(ctx, w, h) {
    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    // 结果窗
    const dx = w * 0.1;
    const dy = h * 0.25;
    const dw = w * 0.8;
    const dh = h * 0.45;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(dx, dy, dw, dh, 15);
    ctx.fill();

    // 结果图标 + 文字
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (this.resultSuccess) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = `bold ${Math.min(36, Math.floor(w * 0.048))}px sans-serif`;
      ctx.fillText('✅ 判断正确！', w / 2, dy + 40);
    } else {
      ctx.fillStyle = '#F44336';
      ctx.font = `bold ${Math.min(36, Math.floor(w * 0.048))}px sans-serif`;
      ctx.fillText('❌ 判断错误', w / 2, dy + 40);
    }

    // 金币变化
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${Math.min(28, Math.floor(w * 0.037))}px sans-serif`;
    ctx.fillText('金币：' + (this.resultGoldChange >= 0 ? '+' : '') + this.resultGoldChange, w / 2, dy + 90);

    // 连击奖励
    if (this.bonusGold > 0) {
      ctx.fillStyle = '#FF6B35';
      ctx.font = `bold ${Math.min(22, Math.floor(w * 0.03))}px sans-serif`;
      ctx.fillText('🔥 连击奖励 +' + this.bonusGold, w / 2, dy + 130);
    }

    // 反诈知识
    if (this.knowledgeText) {
      ctx.fillStyle = '#333333';
      ctx.font = `bold ${Math.min(20, Math.floor(w * 0.027))}px sans-serif`;
      ctx.fillText('📚 反诈小知识', w / 2, dy + 170);
      ctx.fillStyle = '#666666';
      ctx.font = `${Math.min(16, Math.floor(w * 0.022))}px sans-serif`;
      this._wrapText(ctx, this.knowledgeText, dx + 20, dy + 195, dw - 40, 24);
    }

    // 继续按钮
    const btnY = dy + dh - 50;
    const btnW = 180;
    ctx.fillStyle = '#D93A3A';
    ctx.beginPath();
    ctx.roundRect(w / 2 - btnW / 2, btnY, btnW, 40, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.min(24, Math.floor(w * 0.032))}px sans-serif`;
    ctx.fillText('继续闯关', w / 2, btnY + 20);

    this.continueBtnRect = { x: w / 2 - btnW / 2, y: btnY, w: btnW, h: 40 };
  }

  _drawAnimations(ctx, w, h) {
    // 风险闪光
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      if (anim.type === 'flash') {
        anim.progress += 0.02;
        if (anim.progress >= 1) {
          this.animations.splice(i, 1);
          continue;
        }
        const alpha = anim.progress < 0.3
          ? anim.progress / 0.3
          : 1 - (anim.progress - 0.3) / 0.7;
        ctx.fillStyle = anim.color;
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }
    }
  }

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let lineY = y;
    for (const ch of chars) {
      const testLine = line + ch;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, lineY);
        line = ch;
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, lineY);
  }

  // ─── 事件流程 ─────────────────────────────────

  _triggerEvent() {
    if (this.currentEventIndex >= this.events.length) {
      this._finishLevel();
      return;
    }
    const event = this.events[this.currentEventIndex];
    this.currentEvent = event;
    this.dialogActive = true;
    this.hintUsedForCurrent = false;
    this.dialogTitle = event.title || '事件';
    this.dialogContent = event.content || '';
    this.costInvest = event.costInvest || 0;
    this._submitted = false;
    this.dialogBtnRects = [];

    // 启动计时器
    this.timeLeft = 30;
    this.isTimerRunning = true;
    this.timerAccum = 0;
  }

  _handleTimeUp() {
    if (this._submitted) return;
    this._submitted = true;
    this.isTimerRunning = false;

    this._showResult(-1, this.currentEvent);
  }

  _submitChoice(riskChoice) {
    if (this._submitted) return;
    this._submitted = true;
    this.isTimerRunning = false;

    this._showResult(riskChoice, this.currentEvent);
  }

  async _showResult(userChoice, event) {
    // 风险闪光
    const eventFull = this.events.find(e => e.eventId === event.eventId);
    const riskLevel = eventFull ? eventFull.risk_level : userChoice;
    this._addFlash(riskLevel);

    if (userChoice === -1) {
      // 超时
      this.comboCount = 0;
      this.dialogActive = false;
      this.resultActive = true;
      this.resultSuccess = false;
      this.resultGoldChange = 0;
      this.bonusGold = 0;
      this.knowledgeText = null;
      return;
    }

    const investedGold = event.costInvest > 0 ? event.costInvest : 0;

    try {
      const result = await api.submitEvent(
        GameGlobal.databus.userInfo.openid,
        event.eventId,
        userChoice,
        investedGold
      );

      if (result.code === 200) {
        this._applyResult(result.data, event);
      } else {
        GameGlobal.showAlert('提交失败：' + result.message);
        this._nextEvent();
      }
    } catch (err) {
      console.error('Submit error:', err);
      // 离线模式：本地模拟
      this._applyResultOffline(userChoice, event);
    }
  }

  _applyResult(resultData, event) {
    this.dialogActive = false;

    let bonusGold = 0;
    if (resultData.isSuccess) {
      this.comboCount++;
      this.maxCombo = Math.max(this.maxCombo, this.comboCount);
      bonusGold = this.comboCount * 10;
      this.successCount++;
    } else {
      this.comboCount = 0;
      this.failCount++;
    }

    if (this.doubleGoldActive && resultData.isSuccess) {
      resultData.goldChange = (resultData.goldChange || 0) * 2;
      this.doubleGoldActive = false;
    }

    const totalChange = (resultData.goldChange || 0) + bonusGold;
    this.goldCoins = Math.max(0, (resultData.newGold || this.goldCoins) + bonusGold);

    this.resultActive = true;
    this.resultSuccess = resultData.isSuccess;
    this.resultGoldChange = totalChange;
    this.bonusGold = bonusGold;
    this.knowledgeText = resultData.knowledge ? resultData.knowledge.content : null;
  }

  _applyResultOffline(userChoice, event) {
    this.dialogActive = false;

    const eventFull = this.events.find(e => e.eventId === event.eventId);
    const correct = eventFull ? eventFull.risk_level : 1;
    const isSuccess = userChoice === correct;

    let bonusGold = 0;
    if (isSuccess) {
      this.comboCount++;
      this.maxCombo = Math.max(this.maxCombo, this.comboCount);
      bonusGold = this.comboCount * 10;
      this.successCount++;
      this.goldCoins += 50 + bonusGold;
    } else {
      this.comboCount = 0;
      this.failCount++;
      this.goldCoins = Math.max(0, this.goldCoins - 30);
    }

    this.resultActive = true;
    this.resultSuccess = isSuccess;
    this.resultGoldChange = isSuccess ? 50 + bonusGold : -30;
    this.bonusGold = bonusGold;
    this.knowledgeText = null;
  }

  _nextEvent() {
    this.resultActive = false;
    this.continueBtnRect = null;
    this.currentEventIndex++;

    if (this.currentEventIndex < this.events.length) {
      this._nextTimer = setTimeout(() => this._triggerEvent(), 500);
    } else {
      this._nextTimer = setTimeout(() => this._finishLevel(), 500);
    }
  }

  _addFlash(riskLevel) {
    const colorMap = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' };
    this.animations.push({
      type: 'flash',
      color: colorMap[riskLevel] || '#4CAF50',
      progress: 0
    });
  }

  async _finishLevel() {
    const isPass = this.goldCoins >= 0;
    const totalGoldChange = this.goldCoins - this.startGold;

    try {
      await api.finishLevel(
        GameGlobal.databus.userInfo.openid,
        this.sceneType,
        this.events.length,
        this.successCount,
        totalGoldChange,
        isPass
      );
    } catch (err) {
      console.warn('Finish level error:', err);
    }

    GameGlobal.databus.goldCoins = this.goldCoins;

    this.manager.switchTo('Result', {
      isPass,
      successCount: this.successCount,
      failCount: this.failCount,
      goldCoins: this.goldCoins,
      maxCombo: this.maxCombo
    });
  }

  // ─── 触摸处理 ─────────────────────────────────

  handleTouchStart(e) {
    const touch = e.touches[0];
    if (!touch) return;
    const tx = touch.clientX;
    const ty = touch.clientY;

    // 结果弹窗中的继续按钮
    if (this.resultActive && this.continueBtnRect) {
      const r = this.continueBtnRect;
      if (tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h) {
        this._nextEvent();
        return;
      }
    }

    // 对话弹窗中的风险按钮 + 关闭
    if (this.dialogActive && this.dialogBtnRects) {
      // 关闭按钮
      if (this.closeBtnRect) {
        const r = this.closeBtnRect;
        if (tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h) {
          this.dialogActive = false;
          return;
        }
      }

      for (const btn of this.dialogBtnRects) {
        if (tx >= btn.x && tx <= btn.x + btn.w && ty >= btn.y && ty <= btn.y + btn.h) {
          const riskMap = { '✅ 安全': 1, '⚠️ 低风险': 2, '🚫 高风险': 3 };
          this._submitChoice(riskMap[btn.label] || 1);
          return;
        }
      }
    }

    // 游戏区域点击：假装移动到角色位置 → 触发事件
    if (!this.dialogActive && !this.resultActive && this.currentEventIndex < this.events.length) {
      this._triggerEvent();
    }
  }

  handleTouchMove() {}
  handleTouchEnd() {}
}

export default GameScene;
