/**
 * 核心游戏场景（上帝视角）
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
    
    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0xF5F2E9);
    
    // 创建场景背景（简笔画风格）
    this.createSceneBackground(width, height);
    
    // 顶部信息栏
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
    // 简笔画风格背景
    const bg = this.add.graphics();
    bg.lineStyle(3, 0x333333, 0.5);
    
    // 简单绘制场景轮廓
    bg.strokeRect(50, 150, width - 100, height - 250);
    
    // 添加一些装饰线条
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
    this.add.text(30, 25, '💰', { fontSize: '32px' });
    this.goldText = this.add.text(75, 30, `${this.goldCoins}`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    // 事件进度
    this.progressText = this.add.text(width / 2, 30, `事件：0/${this.events.length}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#FFFFFF'
    }).setOrigin(0.5, 0);
    
    // 场景名称
    const sceneName = this.add.text(width - 30, 30, this.sceneType, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#CCCCCC'
    }).setOrigin(1, 0);
  }
  
  createCharacter(width, height) {
    // 简笔画角色
    this.character = this.add.graphics();
    this.character.fillStyle(0x333333, 1);
    this.character.fillCircle(width / 2, height / 2, 30); // 头
    this.character.fillRect(width / 2 - 20, height / 2 + 35, 40, 50); // 身体
    
    // 使角色可交互
    this.character.setInteractive();
    
    // 简单移动控制
    this.input.on('pointerdown', (pointer) => {
      const x = pointer.x;
      const y = pointer.y;
      
      // 移动到点击位置
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
    // 创建事件触发点（可视化）
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
    
    // 道具按钮
    const props = [
      { id: 'detector', name: '🔍', desc: '漏洞探测器' },
      { id: 'stopLoss', name: '🛡️', desc: '止损卡' },
      { id: 'revert', name: '↩️', desc: '撤销卡' }
    ];
    
    let xPos = 50;
    props.forEach(prop => {
      const btn = this.add.text(xPos, height - 70, prop.name, { fontSize: '40px' })
        .setInteractive({ useHandCursor: true });
      
      btn.on('pointerdown', () => {
        this.useProp(prop.id);
      });
      
      const label = this.add.text(xPos + 25, height - 35, prop.desc, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#FFFFFF'
      }).setOrigin(0.5, 0);
      
      xPos += 120;
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
    
    // 显示事件弹窗
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
    dialog.fillRoundedRect(width * 0.1, height * 0.2, width * 0.8, height * 0.55, 15);
    dialog.lineStyle(3, 0x333333);
    dialog.strokeRoundedRect(width * 0.1, height * 0.2, width * 0.8, height * 0.55, 15);
    
    // 事件标题
    const title = this.add.text(width / 2, height * 0.25, event.title, {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#333333',
      fontStyle: 'bold',
      wordWrap: { width: width * 0.7 }
    }).setOrigin(0.5, 0);
    
    // 事件内容
    const content = this.add.text(width * 0.15, height * 0.33, event.content, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#666666',
      wordWrap: { width: width * 0.7 },
      lineSpacing: 10
    });
    
    // 投入金币提示（如果有）
    if (event.costInvest > 0) {
      const costText = this.add.text(width / 2, height * 0.5, `需投入：💰${event.costInvest}金币`, {
        fontFamily: 'Arial',
        fontSize: '26px',
        color: '#D93A3A',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0);
    }
    
    // 风险判断按钮
    const buttons = [
      { text: '安全', risk: 1, color: 0x4CAF50 },
      { text: '低风险', risk: 2, color: 0xFF9800 },
      { text: '高风险', risk: 3, color: 0xF44336 }
    ];
    
    let btnX = width * 0.2;
    buttons.forEach(btn => {
      const button = this.add.text(btnX, height * 0.62, btn.text, {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#FFFFFF',
        backgroundColor: btn.color,
        padding: { x: 25, y: 15 }
      }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      
      button.on('pointerdown', () => {
        this.submitEventChoice(event, btn.risk, overlay, dialog, title, content);
      });
      
      btnX += width * 0.3;
    });
    
    // 关闭按钮
    const closeBtn = this.add.text(width * 0.85, height * 0.23, '✕', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#999999'
    }).setInteractive({ useHandCursor: true });
    
    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      dialog.destroy();
      title.destroy();
      content.destroy();
    });
  }
  
  async submitEventChoice(event, userChoice, ...toDestroy) {
    try {
      const investedGold = event.costInvest > 0 ? event.costInvest : 0;

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

      // 清理弹窗
      toDestroy.forEach(obj => obj && obj.destroy && obj.destroy());

      if (result.code === 200) {
        this.showResultDialog(result.data, event);
      } else {
        GameGlobal.showAlert('提交失败：' + result.message);
      }
    } catch (error) {
      console.error('提交事件错误:', error);
      GameGlobal.showAlert('网络错误，请重试');
    }
  }
  
  showResultDialog(resultData, event) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 半透明背景
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    // 结果弹窗
    const dialog = this.add.graphics();
    dialog.fillStyle(0xFFFFFF, 1);
    dialog.fillRoundedRect(width * 0.1, height * 0.25, width * 0.8, height * 0.45, 15);
    
    // 结果图标和文字
    const icon = resultData.isSuccess ? '✅' : '❌';
    const resultText = resultData.isSuccess ? '判断正确！' : '判断错误';
    const color = resultData.isSuccess ? 0x4CAF50 : 0xF44336;
    
    this.add.text(width / 2, height * 0.32, `${icon} ${resultText}`, {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: color,
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    
    // 金币变化
    const goldChange = resultData.goldChange >= 0 ? `+${resultData.goldChange}` : resultData.goldChange;
    this.add.text(width / 2, height * 0.4, `金币：${goldChange}`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    
    // 更新金币显示
    this.goldCoins = resultData.newGold;
    this.goldText.setText(`${this.goldCoins}`);
    
    if (resultData.isSuccess) {
      this.successCount++;
    } else {
      this.failCount++;
    }
    
    // 反诈科普提示
    if (resultData.knowledge) {
      const knowTitle = this.add.text(width * 0.15, height * 0.48, '📚 反诈小知识', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#333333',
        fontStyle: 'bold'
      });
      
      const knowContent = this.add.text(width * 0.15, height * 0.53, resultData.knowledge.content, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#666666',
        wordWrap: { width: width * 0.7 }
      });
    }
    
    // 继续按钮
    const continueBtn = this.add.text(width / 2, height * 0.62, '继续闯关', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#FFFFFF',
      backgroundColor: '#D93A3A',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    
    continueBtn.on('pointerdown', () => {
      overlay.destroy();
      dialog.destroy();
      this.currentEventIndex++;
      this.progressText.setText(`事件：${this.currentEventIndex}/${this.events.length}`);
      
      if (this.currentEventIndex < this.events.length) {
        this.triggerEvent(this.events[this.currentEventIndex]);
      } else {
        this.finishLevel();
      }
    });
  }
  
  useProp(propId) {
    console.log('使用道具:', propId);
    // 道具使用逻辑
  }
  
  showPauseMenu() {
    // 暂停菜单实现
    console.log('游戏暂停');
  }
  
  async finishLevel() {
    const isPass = this.goldCoins >= 0;

    try {
      await GameGlobal.request({
        url: `${GameGlobal.API_BASE}/game/finish`,
        method: 'POST',
        data: {
          openid: GameGlobal.gameData.userInfo.openid,
          sceneType: this.sceneType,
          eventsTotal: this.events.length,
          eventsSuccess: this.successCount,
          goldChange: this.goldCoins - GameGlobal.gameData.goldCoins,
          result: isPass,
          duration: 0
        }
      });

      // 更新全局数据
      GameGlobal.gameData.goldCoins = this.goldCoins;

      this.scene.start('ResultScene', {
        isPass,
        successCount: this.successCount,
        failCount: this.failCount,
        goldCoins: this.goldCoins
      });
    } catch (error) {
      console.error('完成关卡错误:', error);
      this.scene.start('ResultScene', { isPass, successCount: this.successCount, failCount: this.failCount, goldCoins: this.goldCoins });
    }
  }
}
