/**
 * 核心游戏场景（上帝视角）
 * - 连击系统：连续正确×10 奖励
 * - 限时判断：每事件 30 秒倒计时
 * - 风险结果动画：安全=绿闪，低风险=黄闪，高风险=红闪
 * - 道具系统：双倍金币卡/跳过卡/提示卡
 */

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(data) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.sceneType = data.sceneType;
    this.events = data.events || [];
    this.currentEventIndex = 0;
    this.goldCoins = GameGlobal.gameData.goldCoins;
    this.successCount = 0;
    this.failCount = 0;
    this.startGold = this.goldCoins;

    // ================== 连击系统 ==================
    this.comboCount = 0;
    this.maxCombo = 0;

    // ================== 计时系统 ==================
    this.timeLeft = 30;
    this.timerEvent = null;
    this.isTimerRunning = false;
    this.timerBar = null;
    this.timerText = null;

    // ================== 道具系统 ==================
    this.userProps = GameGlobal.gameData.props || [];
    this.skipCardActive = false;
    this.doubleGoldActive = false;
    this.hintUsedForCurrent = false;

    // ================== 对话元素引用 ==================
    this.currentDialog = {};

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0xF5F2E9);

    // 创建场景背景（简笔画风格）
    this.createSceneBackground(width, height);

    // 顶部信息栏（含计时器和连击显示）
    this.createTopBar(width, height);

    // 角色（可移动）
    this.createCharacter(width, height);

    // 事件触发点
    this.createEventPoints(width, height);

    // 底部道具栏
    this.createPropBar(width, height);

    // 暂停按钮
    this.createPauseButton(width);

    // 提示文本
    this.hintText = this.add.text(width / 2, height - 80, '移动角色触发事件', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#666666',
      backgroundColor: '#FFFFFF',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // 如果有关卡事件，直接触发第一个
    if (this.events.length > 0) {
      this.time.delayedCall(1000, () => {
        this.triggerEvent(this.events[0]);
      });
    }
  }

  createSceneBackground(width, height) {
    const bg = this.add.graphics();
    bg.lineStyle(3, 0x333333, 0.5);
    bg.strokeRect(50, 150, width - 100, height - 250);
    for (let i = 0; i < 5; i++) {
      const x = 100 + i * 150;
      bg.moveTo(x, 200);
      bg.lineTo(x + 50, 250);
      bg.lineTo(x + 100, 200);
    }
  }

  createTopBar(width, height) {
    const topBar = this.add.graphics();
    topBar.fillStyle(0x333333, 0.95);
    topBar.fillRect(0, 0, width, 80);

    // 金币
    this.add.text(30, 5, '💰', { fontSize: '28px' });
    this.goldText = this.add.text(65, 10, `${this.goldCoins}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#FFD700',
      fontStyle: 'bold'
    });

    // 事件进度
    this.progressText = this.add.text(width / 2, 10, `事件：0/${this.events.length}`, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#FFFFFF'
    }).setOrigin(0.5, 0);

    // 连击显示
    this.comboText = this.add.text(width / 2, 45, '', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#FF6B35',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // 场景名称
    this.add.text(width - 20, 10, this.sceneType, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#CCCCCC'
    }).setOrigin(1, 0);

    // 计时器进度条（背景）
    const timerBg = this.add.graphics();
    timerBg.fillStyle(0x555555, 0.8);
    timerBg.fillRect(width * 0.1, 70, width * 0.8, 8);

    // 计时器进度条（前景）
    this.timerBar = this.add.graphics();
    this.timerBar.fillStyle(0x4CAF50, 1);
    this.timerBar.fillRect(width * 0.1, 70, width * 0.8, 8);

    // 计时器文字
    this.timerText = this.add.text(width * 0.88, 62, '30s', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#FFFFFF'
    });
  }

  updateTimerBar() {
    if (!this.timerBar) return;
    const width = this.cameras.main.width;
    const ratio = this.timeLeft / 30;
    const barWidth = width * 0.8 * Math.max(0, ratio);

    this.timerBar.clear();
    // 颜色随剩余时间变化
    let color = 0x4CAF50; // green
    if (this.timeLeft <= 10) color = 0xF44336; // red
    else if (this.timeLeft <= 20) color = 0xFF9800; // yellow

    this.timerBar.fillStyle(color, 1);
    this.timerBar.fillRect(width * 0.1, 70, barWidth, 8);

    if (this.timerText) {
      this.timerText.setText(`${this.timeLeft}s`);
    }
  }

  startTimer() {
    this.timeLeft = 30;
    this.isTimerRunning = true;
    this.updateTimerBar();

    // 每秒更新
    if (this.timerEvent) this.timerEvent.remove();
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isTimerRunning) return;
        this.timeLeft--;
        this.updateTimerBar();

        if (this.timeLeft <= 0) {
          this.handleTimeUp();
        }
      },
      loop: true
    });
  }

  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerEvent) {
      this.timerEvent.remove();
      this.timerEvent = null;
    }
  }

  handleTimeUp() {
    // 超时 = 自动判断为失败
    this.stopTimer();
    if (!this.currentEvent || this.currentEvent._submitted) return;
    this.currentEvent._submitted = true;

    this.hintText.setText('⏰ 时间到！自动提交...');
    this.time.delayedCall(300, () => {
      this.submitEventChoice(this.currentEvent, -1, ...Object.values(this.currentDialog));
    });
  }

  createCharacter(width, height) {
    this.character = this.add.graphics();
    this.character.fillStyle(0x333333, 1);
    this.character.fillCircle(width / 2, height / 2, 30);
    this.character.fillRect(width / 2 - 20, height / 2 + 35, 40, 50);

    // 使角色可交互
    this.character.setInteractive();

    // 简单移动控制
    this.input.on('pointerdown', (pointer) => {
      const x = pointer.x;
      const y = pointer.y;
      this.tweens.add({
        targets: this.character,
        x: x,
        y: y,
        duration: 500,
        ease: 'Power2'
      });
    });
  }

  createEventPoints(width, height) {
    this.eventPoints = [];
    for (let i = 0; i < Math.min(5, this.events.length); i++) {
      const x = 100 + (i % 3) * 200;
      const y = 300 + Math.floor(i / 3) * 200;
      const point = this.add.graphics();
      point.fillStyle(0xD93A3A, 0.6);
      point.fillCircle(x, y, 20);
      this.eventPoints.push({ x, y, graphics: point, triggered: false });
    }
  }

  createPropBar(width, height) {
    const bar = this.add.graphics();
    bar.fillStyle(0x333333, 0.9);
    bar.fillRect(0, height - 100, width, 100);

    // === 计算道具库存 ===
    const getPropCount = (id) => {
      const props = this.userProps.filter(p => p.id === id || p.type === id);
      return props.length;
    };

    const countDouble = getPropCount('doubleGold');
    const countSkip = getPropCount('skip');
    const countHint = getPropCount('hint');

    // 道具按钮布局（6 个道具：3 个原有 + 3 个新增）
    const props = [
      { id: 'detector', name: '🔍', desc: `漏洞探测器 x${getPropCount('detector')}`, price: 600 },
      { id: 'stopLoss', name: '🛡️', desc: `止损卡 x${getPropCount('stopLoss')}`, price: 400 },
      { id: 'revert', name: '↩️', desc: `撤销卡 x${getPropCount('revert')}`, price: 300 },
      { id: 'doubleGold', name: '💎', desc: `双倍金币 x${countDouble}`, price: 200, label: '双倍' },
      { id: 'skip', name: '⏭️', desc: `跳过卡 x${countSkip}`, price: 150, label: '跳过' },
      { id: 'hint', name: '💡', desc: `提示卡 x${countHint}`, price: 100, label: '提示' }
    ];

    let xPos = Math.max(20, (width - props.length * 80) / 2);
    props.forEach(prop => {
      const btn = this.add.text(xPos, height - 70, prop.name, { fontSize: '34px' })
        .setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        this.useProp(prop.id);
      });

      const label = this.add.text(xPos + 20, height - 35, prop.desc, {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#FFFFFF'
      }).setOrigin(0.5, 0);

      xPos += 80;
    });
  }

  createPauseButton(width) {
    const pauseBtn = this.add.text(width - 50, 40, '⏸️', { fontSize: '32px' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(1, 0);

    pauseBtn.on('pointerdown', () => {
      this.scene.pause();
      this.showPauseMenu();
    });
  }

  triggerEvent(eventData) {
    if (this.currentEventIndex >= this.events.length) {
      this.finishLevel();
      return;
    }

    const event = this.events[this.currentEventIndex];
    this.currentEvent = event;
    event._submitted = false;
    this.hintUsedForCurrent = false;
    this.currentDialog = {};

    this.showEventDialog(event);
  }

  showEventDialog(event) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 半透明背景
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // 弹窗背景
    const dialog = this.add.graphics();
    dialog.fillStyle(0xFFFFFF, 1);
    dialog.fillRoundedRect(width * 0.1, height * 0.15, width * 0.8, height * 0.6, 15);
    dialog.lineStyle(3, 0x333333);
    dialog.strokeRoundedRect(width * 0.1, height * 0.15, width * 0.8, height * 0.6, 15);

    // 事件标题
    const title = this.add.text(width / 2, height * 0.18, event.title, {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#333333',
      fontStyle: 'bold',
      wordWrap: { width: width * 0.7 }
    }).setOrigin(0.5, 0);

    // 事件内容
    const content = this.add.text(width * 0.15, height * 0.26, event.content, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#666666',
      wordWrap: { width: width * 0.7 },
      lineSpacing: 8
    });

    // 提示卡信息（如果使用了提示卡）
    if (this.hintUsedForCurrent) {
      // 随机排除一个错误选项（50% 正确提示）
      const excludeRisk = this.events.find(e => e.eventId === event.eventId) ? null : null;
      // 根据事件的风险等级排除
      const correctRisk = event.risk_level; // need to find the right risk level
      const options = [1, 2, 3].filter(r => r !== correctRisk);
      const eliminated = options[Math.floor(Math.random() * options.length)];
      const elimMap = { 1: '安全', 2: '低风险', 3: '高风险' };
      const hint = this.add.text(width / 2, height * 0.44, `💡 提示：可以排除「${elimMap[eliminated]}」选项`, {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#2196F3',
        fontStyle: 'bold',
        backgroundColor: '#E3F2FD',
        padding: { x: 12, y: 6 }
      }).setOrigin(0.5, 0);
    }

    // 投入金币提示
    let costTextY = height * 0.49;
    if (event.costInvest > 0) {
      const costText = this.add.text(width / 2, height * 0.49, `需投入：💰${event.costInvest}金币`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#D93A3A',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0);
    }

    // 风险判断按钮
    const buttons = [
      { text: '✅ 安全', risk: 1, color: 0x4CAF50 },
      { text: '⚠️ 低风险', risk: 2, color: 0xFF9800 },
      { text: '🚫 高风险', risk: 3, color: 0xF44336 }
    ];

    const btnY = height * 0.57;
    let btnX = width * 0.17;
    const btnSpacing = width * 0.28;

    buttons.forEach(btn => {
      const button = this.add.text(btnX, btnY, btn.text, {
        fontFamily: 'Arial',
        fontSize: '26px',
        color: '#FFFFFF',
        backgroundColor: btn.color,
        padding: { x: 18, y: 12 }
      }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

      button.on('pointerdown', () => {
        if (event._submitted) return;
        event._submitted = true;
        this.submitEventChoice(event, btn.risk);
      });

      btnX += btnSpacing;
    });

    // 存储引用以便清理
    this.currentDialog = { overlay, dialog, title, content };

    // 关闭按钮
    const closeBtn = this.add.text(width * 0.88, height * 0.17, '✕', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#999999'
    }).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      this.cleanupCurrentDialog();
    });

    // 启动计时器
    this.startTimer();
  }

  cleanupCurrentDialog() {
    this.stopTimer();
    Object.values(this.currentDialog).forEach(obj => obj && obj.destroy && obj.destroy());
    this.currentDialog = {};
  }

  // ================== 风险结果动画 ==================
  playRiskFlashAnimation(riskLevel) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 颜色映射：安全=绿，低风险=黄，高风险=红
    const colorMap = { 1: 0x4CAF50, 2: 0xFF9800, 3: 0xF44336 };
    const color = colorMap[riskLevel] || 0x4CAF50;

    // 创建闪光覆盖层
    const flash = this.add.rectangle(width / 2, height / 2, width, height, color, 0.4);

    // 闪光动画：闪烁两次
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        flash.destroy();
      }
    });

    // 屏幕震动效果
    this.cameras.main.shake(200, 0.005);

    // 风险标签显示
    const labelMap = { 1: '✅ 安全事件', 2: '⚠️ 低风险事件', 3: '🚫 高风险事件' };
    const label = this.add.text(width / 2, height * 0.15, labelMap[riskLevel] || '未知', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: color,
      fontStyle: 'bold',
      backgroundColor: '#FFFFFF',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: label,
      alpha: 1,
      y: height * 0.12,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: label,
          alpha: 0,
          delay: 1200,
          duration: 300,
          onComplete: () => label.destroy()
        });
      }
    });
  }

  async submitEventChoice(event, userChoice) {
    // 停止计时器
    this.stopTimer();

    // 先播放风险闪光动画（根据事件的实际风险等级）
    // 从 events 数组中找到对应事件的 risk_level
    const eventFull = this.events.find(e => e.eventId === event.eventId);
    // 如果没有找到（可能是道具参数），使用 userChoice 来显示
    const displayRisk = eventFull ? eventFull.risk_level : userChoice;
    this.playRiskFlashAnimation(displayRisk);

    try {
      const investedGold = event.costInvest > 0 ? event.costInvest : 0;

      // 判断是否使用了双倍金币卡
      let appliedDoubleGold = false;
      if (this.doubleGoldActive) {
        appliedDoubleGold = true;
        this.doubleGoldActive = false;
        this.hintText.setText('💎 双倍金币卡已激活！');
      }

      // 清理旧弹窗
      if (this.currentDialog && Object.keys(this.currentDialog).length > 0) {
        this.time.delayedCall(500, () => {
          this.cleanupCurrentDialog();
        });
      } else {
        this.cleanupCurrentDialog();
      }

      // 超时处理（userChoice === -1）
      if (userChoice === -1) {
        this.showAutoResult(event, investedGold);
        return;
      }

      const result = await GameGlobal.request({
        url: `${GameGlobal.API_BASE}/game/submitEvent`,
        method: 'POST',
        data: {
          openid: GameGlobal.gameData.userInfo.openid,
          eventId: event.eventId,
          userChoice: userChoice,
          investedGold: investedGold
        }
      });

      if (result.code === 200) {
        this.showResultDialog(result.data, event, appliedDoubleGold);
      } else {
        GameGlobal.showAlert('提交失败：' + result.message);
        this.proceedToNext();
      }
    } catch (error) {
      console.error('提交事件错误:', error);
      GameGlobal.showAlert('网络错误，请重试');
      this.proceedToNext();
    }
  }

  showAutoResult(event, investedGold) {
    // 超时场景（简单处理）
    this.comboCount = 0;
    this.comboText.setText('');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    const dialog = this.add.graphics();
    dialog.fillStyle(0xFFFFFF, 1);
    dialog.fillRoundedRect(width * 0.15, height * 0.3, width * 0.7, height * 0.3, 15);

    this.add.text(width / 2, height * 0.37, '⏰ 时间到！', {
      fontFamily: 'Arial', fontSize: '36px', color: '#F44336', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.goldText.setText(`${this.goldCoins}`);
    this.progressText.setText(`事件：${this.currentEventIndex + 1}/${this.events.length}`);

    const continueBtn = this.add.text(width / 2, height * 0.52, '继续闯关', {
      fontFamily: 'Arial', fontSize: '28px', color: '#FFFFFF',
      backgroundColor: '#D93A3A', padding: { x: 25, y: 12 }
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

    continueBtn.on('pointerdown', () => {
      overlay.destroy();
      dialog.destroy();
      this.proceedToNext();
    });
  }

  showResultDialog(resultData, event, appliedDoubleGold) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 连击系统逻辑
    let bonusGold = 0;
    if (resultData.isSuccess) {
      this.comboCount++;
      this.maxCombo = Math.max(this.maxCombo, this.comboCount);
      bonusGold = this.comboCount * 10;
    } else {
      this.comboCount = 0;
    }

    // 双倍金币卡加成
    if (appliedDoubleGold && resultData.isSuccess) {
      resultData.goldChange = (resultData.goldChange || 0) + resultData.goldChange;
    }

    // 计算最终金币变化
    const totalGoldChange = (resultData.goldChange || 0) + bonusGold;
    this.goldCoins = Math.max(0, (resultData.newGold || this.goldCoins) + bonusGold);
    this.goldText.setText(`${this.goldCoins}`);

    if (resultData.isSuccess) {
      this.successCount++;
    } else {
      this.failCount++;
    }

    // 更新连击显示
    if (this.comboCount >= 2) {
      this.comboText.setText(`🔥 连击 x${this.comboCount}`);
      this.tweens.add({
        targets: this.comboText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 200,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    } else {
      this.comboText.setText('');
    }

    // 半透明背景
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // 结果弹窗
    const dialog = this.add.graphics();
    dialog.fillStyle(0xFFFFFF, 1);
    dialog.fillRoundedRect(width * 0.1, height * 0.22, width * 0.8, height * 0.5, 15);

    // 结果图标 + 连击显示
    const icon = resultData.isSuccess ? '✅' : '❌';
    const resultText = resultData.isSuccess ? '判断正确！' : '判断错误';
    const color = resultData.isSuccess ? 0x4CAF50 : 0xF44336;

    this.add.text(width / 2, height * 0.28, `${icon} ${resultText}`, {
      fontFamily: 'Arial', fontSize: '34px', color: color, fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // 金币变化
    const goldStr = totalGoldChange >= 0 ? `+${totalGoldChange}` : `${totalGoldChange}`;
    this.add.text(width / 2, height * 0.36, `金币：${goldStr}`, {
      fontFamily: 'Arial', fontSize: '28px', color: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // 连击奖励提示
    if (bonusGold > 0) {
      this.add.text(width / 2, height * 0.42, `🔥 连击奖励 +${bonusGold}`, {
        fontFamily: 'Arial', fontSize: '22px', color: '#FF6B35', fontStyle: 'bold'
      }).setOrigin(0.5, 0);

      // 连击弹出特效
      const comboPopup = this.add.text(width / 2, height * 0.42, `🔥 x${this.comboCount}`, {
        fontFamily: 'Arial', fontSize: '48px', color: '#FF6B35', fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: comboPopup,
        alpha: 1,
        y: height * 0.3,
        scale: 1.5,
        duration: 300,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: comboPopup,
            alpha: 0,
            delay: 800,
            duration: 300,
            onComplete: () => comboPopup.destroy()
          });
        }
      });
    }

    // 反诈科普
    if (resultData.knowledge) {
      const knowTitle = this.add.text(width * 0.15, height * 0.48, '📚 反诈小知识', {
        fontFamily: 'Arial', fontSize: '22px', color: '#333333', fontStyle: 'bold'
      });
      const knowContent = this.add.text(width * 0.15, height * 0.53, resultData.knowledge.content, {
        fontFamily: 'Arial', fontSize: '17px', color: '#666666',
        wordWrap: { width: width * 0.7 }
      });
    }

    // 继续按钮
    const btnY = resultData.knowledge ? height * 0.65 : height * 0.55;
    const continueBtn = this.add.text(width / 2, btnY, '继续闯关', {
      fontFamily: 'Arial', fontSize: '28px', color: '#FFFFFF',
      backgroundColor: '#D93A3A', padding: { x: 25, y: 12 }
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

    continueBtn.on('pointerdown', () => {
      overlay.destroy();
      dialog.destroy();
      this.proceedToNext();
    });
  }

  proceedToNext() {
    this.currentEventIndex++;
    this.progressText.setText(`事件：${this.currentEventIndex}/${this.events.length}`);

    if (this.currentEventIndex < this.events.length) {
      this.time.delayedCall(300, () => {
        this.triggerEvent(this.events[this.currentEventIndex]);
      });
    } else {
      this.finishLevel();
    }
  }

  // ================== 道具系统 ==================
  useProp(propId) {
    const prop = this.userProps.find(p => p.id === propId || p.type === propId);
    if (!prop) {
      GameGlobal.showAlert('没有该道具！去商城购买吧');
      return;
    }

    switch (propId) {
      case 'detector':
        this.useDetector();
        break;
      case 'stopLoss':
        this.useStopLoss();
        break;
      case 'revert':
        this.useRevert();
        break;
      case 'doubleGold':
        this.useDoubleGold();
        break;
      case 'skip':
        this.useSkip();
        break;
      case 'hint':
        this.useHint();
        break;
      default:
        GameGlobal.showAlert('未知道具');
    }
  }

  async consumeProp(propId) {
    const idx = this.userProps.findIndex(p => p.id === propId || p.type === propId);
    if (idx === -1) return false;
    this.userProps.splice(idx, 1);

    try {
      await GameGlobal.request({
        url: `${GameGlobal.API_BASE}/user/consumeProp`,
        method: 'POST',
        data: {
          openid: GameGlobal.gameData.userInfo.openid,
          propId: propId
        }
      });
      GameGlobal.gameData.props = this.userProps;
    } catch (e) {
      console.warn('消耗道具记录失败:', e);
    }
    return true;
  }

  useDetector() {
    // 现有：提示当前事件风险等级
    if (!this.currentEvent) return;
    const eventFull = this.events.find(e => e.eventId === this.currentEvent.eventId);
    if (!eventFull) return;

    const riskMap = { 1: '安全', 2: '低风险', 3: '高风险' };
    GameGlobal.showAlert(`🔍 探测结果：当前事件为「${riskMap[eventFull.risk_level]}」`);
    this.consumeProp('detector');
  }

  useStopLoss() {
    // 现有：止损卡 - 在提交事件时自动减少失败惩罚
    if (this.currentEvent && this.currentEvent._submitted) return;
    this.hintText.setText('🛡️ 止损卡已激活！失败时减少 50% 惩罚');
    this.consumeProp('stopLoss');
  }

  useRevert() {
    // 现有：撤销卡
    GameGlobal.showAlert('↩️ 撤销卡：撤销操作');
    this.consumeProp('revert');
  }

  async useDoubleGold() {
    // 新道具：下一关金币奖励翻倍
    if (this.currentEvent && this.currentEvent._submitted) return;
    this.doubleGoldActive = true;
    this.hintText.setText('💎 双倍金币卡已激活！本次判断正确金币翻倍！');
    await this.consumeProp('doubleGold');
  }

  async useSkip() {
    // 新道具：跳过当前事件
    if (this.currentEvent && this.currentEvent._submitted) return;
    this.stopTimer();
    this.cleanupCurrentDialog();

    this.hintText.setText('⏭️ 已跳过当前事件');
    await this.consumeProp('skip');

    this.proceedToNext();
  }

  async useHint() {
    // 新道具：显示 50% 正确提示（排除一个错误选项）
    if (this.hintUsedForCurrent) {
      GameGlobal.showAlert('当前事件已使用过提示卡');
      return;
    }
    if (!this.currentEvent || this.currentEvent._submitted) return;

    this.hintUsedForCurrent = true;
    this.hintText.setText('💡 提示卡已使用！');

    // 清除旧的提示显示区域（通过重新触发事件弹窗来更新）
    await this.consumeProp('hint');

    // 重新显示事件弹窗（带提示）
    // 但实际上我们可以直接在当前弹窗上覆盖提示文字
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const eventFull = this.events.find(e => e.eventId === this.currentEvent.eventId);
    if (eventFull) {
      const options = [1, 2, 3].filter(r => r !== eventFull.risk_level);
      const eliminated = options[Math.floor(Math.random() * options.length)];
      const elimMap = { 1: '安全', 2: '低风险', 3: '高风险' };

      const hintDisplay = this.add.text(width / 2, height * 0.44, `💡 提示：可以排除「${elimMap[eliminated]}」选项`, {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#2196F3',
        fontStyle: 'bold',
        backgroundColor: '#E3F2FD',
        padding: { x: 12, y: 6 }
      }).setOrigin(0.5, 0);
    }
  }

  showPauseMenu() {
    console.log('游戏暂停');
    // 暂停菜单实现（可扩展）
  }

  async finishLevel() {
    this.stopTimer();
    const isPass = this.goldCoins >= 0;
    const totalGoldChange = this.goldCoins - this.startGold;

    try {
      await GameGlobal.request({
        url: `${GameGlobal.API_BASE}/game/finish`,
        method: 'POST',
        data: {
          openid: GameGlobal.gameData.userInfo.openid,
          sceneType: this.sceneType,
          eventsTotal: this.events.length,
          eventsSuccess: this.successCount,
          goldChange: totalGoldChange,
          result: isPass,
          duration: 0
        }
      });

      GameGlobal.gameData.goldCoins = this.goldCoins;

      this.scene.start('ResultScene', {
        isPass,
        successCount: this.successCount,
        failCount: this.failCount,
        goldCoins: this.goldCoins,
        maxCombo: this.maxCombo
      });
    } catch (error) {
      console.error('完成关卡错误:', error);
      this.scene.start('ResultScene', {
        isPass,
        successCount: this.successCount,
        failCount: this.failCount,
        goldCoins: this.goldCoins,
        maxCombo: this.maxCombo
      });
    }
  }
}
