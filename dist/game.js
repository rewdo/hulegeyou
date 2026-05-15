(function () {
  'use strict';

  /**
   * 启动加载场景
   */

  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    preload() {
      // 显示加载进度
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // 加载背景
      this.add.rectangle(width / 2, height / 2, width, height, 0xF5F2E9);
      
      // 加载文字
      this.add.text(width / 2, height / 2 - 50, '忽了个悠', {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(width / 2, height / 2, '反诈科普·寓教于乐', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#666666'
      }).setOrigin(0.5);
      
      // 加载进度条背景
      const progressBar = this.add.graphics();
      const progressBox = this.add.graphics();
      progressBox.fillStyle(0xcccccc, 0.8);
      progressBox.fillRect(width / 2 - 150, height / 2 + 50, 300, 20);
      
      // 加载文本
      const loadingText = this.add.text(width / 2, height / 2 + 80, '加载中...', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#333333'
      }).setOrigin(0.5);
      
      // 进度更新
      this.load.on('progress', (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xD93A3A, 1);
        progressBar.fillRect(width / 2 - 145, height / 2 + 52, 290 * value, 16);
        loadingText.setText(`加载中... ${Math.floor(value * 100)}%`);
      });
      
      this.load.on('complete', () => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
      });
      
      // 加载美术资源（SVG 矢量贴图）
      // ===== 主背景 =====
      this.load.image('bg_start', 'assets/images/bg_start.svg');
      this.load.image('bg_game_scene', 'assets/images/bg_game_scene.svg');
      this.load.image('bg_result_pass', 'assets/images/bg_result_pass.svg');
      this.load.image('bg_result_fail', 'assets/images/bg_result_fail.svg');
      this.load.image('bg_top_bar', 'assets/images/bg_top_bar.svg');
      this.load.image('bg_prop_bar', 'assets/images/bg_prop_bar.svg');
      this.load.image('bg_dialog', 'assets/images/bg_dialog.svg');

      // ===== 角色与 NPC =====
      this.load.image('character_default', 'assets/images/character_default.svg');
      this.load.image('npc_professor', 'assets/images/npc_professor.svg');

      // ===== UI 按钮 =====
      this.load.image('btn_start', 'assets/images/btn_start.svg');
      this.load.image('btn_help', 'assets/images/btn_help.svg');
      this.load.image('btn_pause', 'assets/images/btn_pause.svg');

      // ===== 道具图标 =====
      this.load.image('btn_detector', 'assets/images/btn_detector.svg');
      this.load.image('btn_stopLoss', 'assets/images/btn_stopLoss.svg');
      this.load.image('btn_revert', 'assets/images/btn_revert.svg');

      // ===== 状态图标 =====
      this.load.image('icon_gold', 'assets/images/icon_gold.svg');
      this.load.image('icon_level', 'assets/images/icon_level.svg');
      this.load.image('icon_success', 'assets/images/icon_success.svg');
      this.load.image('icon_fail', 'assets/images/icon_fail.svg');
      this.load.image('icon_coin', 'assets/images/icon_coin.svg');

      // ===== 游戏标题 =====
      this.load.image('logo_title', 'assets/images/logo_title.svg');
      
      // 加载音效
      this.load.audio('bgm_main', 'assets/audio/bgm_main.wav');
      this.load.audio('sfx_click', 'assets/audio/sfx_click.wav');
      this.load.audio('sfx_success', 'assets/audio/sfx_success.wav');
      this.load.audio('sfx_fail', 'assets/audio/sfx_fail.wav');
      this.load.audio('sfx_coin', 'assets/audio/sfx_coin.wav');
      this.load.audio('sfx_levelup', 'assets/audio/sfx_levelup.wav');
      this.load.audio('sfx_open', 'assets/audio/sfx_open.wav');
      this.load.audio('sfx_move', 'assets/audio/sfx_move.wav');
    }

    create() {
      // 延迟进入主菜单，确保资源加载完成
      this.time.delayedCall(500, () => {
        this.scene.start('StartScene');
      });
    }
  }

  /**
   * 游戏启动页场景
   */

  class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' });
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // 启动页背景（带墨水瓶+简笔画装饰）
      this.add.image(width / 2, height / 2, 'bg_start').setDisplaySize(width, height);
      
      // 游戏标题 Logo
      this.add.image(width / 2, height * 0.22, 'logo_title').setScale(1.5);
      
      // 副标题
      this.add.text(width / 2, height * 0.32, '反诈科普·寓教于乐', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#666666'
      }).setOrigin(0.5);
      
      // 简笔画角色
      this.add.image(width / 2, height * 0.46, 'character_default').setScale(1.3);
      
      // 开始游戏按钮
      const startBtn = this.add.text(width / 2, height * 0.65, '开始游戏', {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#FFFFFF',
        backgroundColor: '#D93A3A',
        padding: { x: 40, y: 20 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      startBtn.on('pointerdown', () => {
        this.playClickSound();
        this.initUser();
      });
      
      startBtn.on('pointerover', () => startBtn.setAlpha(0.9));
      startBtn.on('pointerout', () => startBtn.setAlpha(1));
      
      // 帮助按钮
      const helpBtn = this.add.text(width / 2, height * 0.75, '帮助', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#333333',
        backgroundColor: '#E0E0E0',
        padding: { x: 30, y: 15 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      helpBtn.on('pointerdown', () => {
        this.playClickSound();
        this.scene.start('HelpScene');
      });
      
      helpBtn.on('pointerover', () => helpBtn.setAlpha(0.9));
      helpBtn.on('pointerout', () => helpBtn.setAlpha(1));
      
      // 底部文案
      this.add.text(width / 2, height - 50, '反诈科普·寓教于乐', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#999999'
      }).setOrigin(0.5);
      
      // 播放背景音乐
      this.playBGM();
    }
    
    async initUser() {
      // 模拟用户登录
      try {
        // 实际应从微信获取 openid
        const openid = 'test_user_' + Date.now();
        
        const result = await GameGlobal.request({
          url: `${GameGlobal.API_BASE}/user/login`,
          method: 'POST',
          data: { openid, nickname: '悠客' }
        });

        if (result.code === 200) {
          GameGlobal.gameData.userInfo = result.data;
          GameGlobal.gameData.goldCoins = result.data.gold_coins;
          GameGlobal.gameData.roleLevel = result.data.role_level;
          GameGlobal.gameData.unlockedScenes = result.data.unlocked_scenes;

          this.scene.start('LevelSelectScene');
        } else {
          GameGlobal.showAlert('登录失败：' + result.message);
        }
      } catch (error) {
        console.error('登录错误:', error);
        // 离线模式
        GameGlobal.gameData.userInfo = {
          openid: 'offline_user',
          nickname: '悠客',
          gold_coins: 2000,
          role_level: 1,
          unlocked_scenes: ['校园权限场景', '社交福利场景']
        };
        this.scene.start('LevelSelectScene');
      }
    }
    
    playClickSound() {
      // 播放点击音效
      if (this.sound) {
        this.sound.play('sfx_click', { volume: 0.3 });
      }
    }
    
    playBGM() {
      // 播放背景音乐
      if (this.sound) {
        this.sound.play('bgm_main', { volume: 0.3, loop: true });
      }
    }
  }

  /**
   * 关卡选择场景
   */

  class LevelSelectScene extends Phaser.Scene {
    constructor() {
      super({ key: 'LevelSelectScene' });
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // 背景
      this.add.image(width / 2, height / 2, 'bg_start').setDisplaySize(width, height);
      
      // 顶部信息栏
      this.createTopBar(width, height);
      
      // 标题
      this.add.text(width / 2, height * 0.15, '选择关卡', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // 场景列表
      this.createSceneList(width, height);
      
      // 返回按钮
      const backBtn = this.add.text(50, 50, '←', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#333333'
      }).setInteractive({ useHandCursor: true });
      
      backBtn.on('pointerdown', () => {
        this.scene.start('StartScene');
      });
    }
    
    createTopBar(width, height) {
      // 顶部信息栏背景
      this.add.image(width / 2, 50, 'bg_top_bar').setDisplaySize(width, 100);
      
      // 金币图标 + 数量
      this.add.image(50, 50, 'icon_gold').setScale(0.3);
      this.add.text(85, 40, `${GameGlobal.gameData.goldCoins}`, {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#FFD700',
        fontStyle: 'bold'
      });
      
      // 等级图标 + 等级
      this.add.image(width - 140, 50, 'icon_level').setScale(0.25);
      this.add.text(width - 115, 40, `Lv.${GameGlobal.gameData.roleLevel}`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#FFFFFF'
      });
      
      // 商城按钮
      const shopBtn = this.add.image(width - 60, 50, 'icon_gold').setScale(0.35)
        .setInteractive({ useHandCursor: true });
      this.add.text(width - 60, 80, '商城', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#FFD700'
      }).setOrigin(0.5, 0);
      
      shopBtn.on('pointerdown', () => {
        this.scene.start('ShopScene');
      });
    }
    
    createSceneList(width, height) {
      const scenes = [
        { id: '校园权限场景', name: '🏫 校园权限', level: 1, locked: false },
        { id: '社交福利场景', name: '💬 社交福利', level: 1, locked: false },
        { id: '校园兼职场景', name: '💼 校园兼职', level: 2, locked: GameGlobal.gameData.roleLevel < 2 },
        { id: '二手交易场景', name: '🛍️ 二手交易', level: 2, locked: GameGlobal.gameData.roleLevel < 2 },
        { id: '租房场景', name: '🏠 租房生活', level: 3, locked: GameGlobal.gameData.roleLevel < 3 },
        { id: '消费维权场景', name: '⚖️ 消费维权', level: 3, locked: GameGlobal.gameData.roleLevel < 3 },
        { id: '职场入职场景', name: '👔 职场入职', level: 4, locked: GameGlobal.gameData.roleLevel < 4 },
        { id: '基础金融场景', name: '💰 基础金融', level: 4, locked: GameGlobal.gameData.roleLevel < 4 },
        { id: '法律合同场景', name: '📜 法律合同', level: 5, locked: GameGlobal.gameData.roleLevel < 5 },
        { id: '高端诈骗场景', name: '🎭 高端诈骗', level: 5, locked: GameGlobal.gameData.roleLevel < 5 }
      ];
      
      let yPos = height * 0.25;
      const itemHeight = 80;
      
      scenes.forEach((scene, index) => {
        const bg = this.add.graphics();
        
        if (scene.locked) {
          bg.fillStyle(0xE0E0E0, 0.5);
        } else {
          bg.fillStyle(0xFFFFFF, 1);
          bg.lineStyle(2, 0x333333);
        }
        
        bg.fillRoundedRect(width * 0.1, yPos, width * 0.8, itemHeight, 10);
        if (!scene.locked) bg.strokeRoundedRect(width * 0.1, yPos, width * 0.8, itemHeight, 10);
        
        // 场景名称
        this.add.text(width * 0.15, yPos + 25, scene.name, {
          fontFamily: 'Arial',
          fontSize: '28px',
          color: scene.locked ? '#999999' : '#333333'
        });
        
        // 等级要求
        if (scene.locked) {
          this.add.text(width * 0.85, yPos + 25, `🔒 Lv.${scene.level}`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#999999'
          }).setOrigin(1, 0);
        }
        
        // 开始按钮（仅解锁场景）
        if (!scene.locked) {
          const startBtn = this.add.text(width * 0.75, yPos + 25, '开始闯关', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#FFFFFF',
            backgroundColor: '#D93A3A',
            padding: { x: 15, y: 8 }
          }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
          
          startBtn.on('pointerdown', () => {
            this.startLevel(scene.id);
          });
        }
        
        yPos += itemHeight + 15;
      });
    }
    
    async startLevel(sceneType) {
      GameGlobal.gameData.currentScene = sceneType;

      try {
        const result = await GameGlobal.request({
          url: `${GameGlobal.API_BASE}/game/start`,
          method: 'POST',
          data: {
            openid: GameGlobal.gameData.userInfo.openid,
            sceneType: sceneType,
            level: 1
          }
        });

        if (result.code === 200) {
          GameGlobal.gameData.events = result.data.session.events;
          GameGlobal.gameData.currentLevel = result.data.session.level;
          this.scene.start('GameScene', { sceneType, events: result.data.session.events });
        } else {
          GameGlobal.showAlert('开始失败：' + result.message);
        }
      } catch (error) {
        console.error('开始关卡错误:', error);
        GameGlobal.showAlert('网络错误，请重试');
      }
    }
  }

  /**
   * 核心游戏场景（上帝视角）
   * - 连击系统：连续正确×10 奖励
   * - 限时判断：每事件 30 秒倒计时
   * - 风险结果动画：安全=绿闪，低风险=黄闪，高风险=红闪
   * - 道具系统：双倍金币卡/跳过卡/提示卡
   */

  class GameScene extends Phaser.Scene {
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

        this.add.text(xPos + 20, height - 35, prop.desc, {
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
        this.events.find(e => e.eventId === event.eventId) ? null : null;
        // 根据事件的风险等级排除
        const correctRisk = event.risk_level; // need to find the right risk level
        const options = [1, 2, 3].filter(r => r !== correctRisk);
        const eliminated = options[Math.floor(Math.random() * options.length)];
        const elimMap = { 1: '安全', 2: '低风险', 3: '高风险' };
        this.add.text(width / 2, height * 0.44, `💡 提示：可以排除「${elimMap[eliminated]}」选项`, {
          fontFamily: 'Arial',
          fontSize: '22px',
          color: '#2196F3',
          fontStyle: 'bold',
          backgroundColor: '#E3F2FD',
          padding: { x: 12, y: 6 }
        }).setOrigin(0.5, 0);
      }
      if (event.costInvest > 0) {
        this.add.text(width / 2, height * 0.49, `需投入：💰${event.costInvest}金币`, {
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
        this.add.text(width * 0.15, height * 0.48, '📚 反诈小知识', {
          fontFamily: 'Arial', fontSize: '22px', color: '#333333', fontStyle: 'bold'
        });
        this.add.text(width * 0.15, height * 0.53, resultData.knowledge.content, {
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

        this.add.text(width / 2, height * 0.44, `💡 提示：可以排除「${elimMap[eliminated]}」选项`, {
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

  /**
   * 关卡结果场景
   */

  class ResultScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ResultScene' });
    }

    create(data) {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      this.isPass = data.isPass;
      this.successCount = data.successCount;
      this.failCount = data.failCount;
      this.goldCoins = data.goldCoins;
      
      // 根据结果选择背景
      const bgKey = this.isPass ? 'bg_result_pass' : 'bg_result_fail';
      this.add.image(width / 2, height / 2, bgKey).setDisplaySize(width, height);
      
      // 结果图标
      const iconKey = this.isPass ? 'icon_success' : 'icon_fail';
      this.add.image(width / 2, height * 0.27, iconKey).setScale(0.7);
      
      // 结果文字
      const resultText = this.isPass ? '闯关成功！' : '闯关失败';
      const color = this.isPass ? 0x4CAF50 : 0xF44336;
      
      this.add.text(width / 2, height * 0.38, resultText, {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: color,
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // 统计数据
      const stats = [
        `成功识别：${this.successCount}个`,
        `失败识别：${this.failCount}个`,
        `当前金币：💰${this.goldCoins}`
      ];
      
      let yPos = height * 0.48;
      stats.forEach(stat => {
        this.add.text(width / 2, yPos, stat, {
          fontFamily: 'Arial',
          fontSize: '28px',
          color: '#333333'
        }).setOrigin(0.5);
        yPos += 45;
      });
      
      // 按钮
      if (this.isPass) {
        // 下一关按钮
        const nextBtn = this.add.text(width / 2, height * 0.65, '返回关卡选择', {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#FFFFFF',
          backgroundColor: '#D93A3A',
          padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        nextBtn.on('pointerdown', () => {
          this.scene.start('LevelSelectScene');
        });
      } else {
        // 再来一次按钮
        const retryBtn = this.add.text(width / 2, height * 0.6, '再来一次', {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#FFFFFF',
          backgroundColor: '#D93A3A',
          padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        retryBtn.on('pointerdown', () => {
          this.scene.start('GameScene', { sceneType: GameGlobal.gameData.currentScene, events: GameGlobal.gameData.events });
        });
        
        // 分享助力按钮
        const shareBtn = this.add.text(width / 2, height * 0.72, '分享求助', {
          fontFamily: 'Arial',
          fontSize: '28px',
          color: '#D93A3A',
          backgroundColor: '#FFFFFF',
          padding: { x: 25, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        shareBtn.on('pointerdown', () => {
          this.shareForHelp();
        });
      }
      
      // 返回按钮
      const backBtn = this.add.text(width / 2, height * 0.82, '返回首页', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#666666'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      backBtn.on('pointerdown', () => {
        this.scene.start('StartScene');
      });
    }
    
    async shareForHelp() {
      try {
        const result = await GameGlobal.request({
          url: `${GameGlobal.API_BASE}/share/create`,
          method: 'POST',
          data: {
            openid: GameGlobal.gameData.userInfo.openid,
            helpType: 1 // 补助金
          }
        });

        if (result.code === 200) {
          if (wx && wx.shareAppMessage) {
            wx.shareAppMessage({
              title: '帮我助力！《忽了个悠》反诈闯关，一起学防骗知识！',
              imageUrlId: '',
              imageUrl: ''
            });
          } else {
            GameGlobal.showAlert('分享链接：' + result.data.shareUrl);
          }
        }
      } catch (error) {
        console.error('分享错误:', error);
      }
    }
  }

  /**
   * 商城/背包场景
   */

  class ShopScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ShopScene' });
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // 背景
      this.add.image(width / 2, height / 2, 'bg_start').setDisplaySize(width, height);
      
      // 标题
      this.add.text(width / 2, 60, '道具商城', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0);
      
      // 金币显示
      this.add.image(width - 60, 70, 'icon_gold').setScale(0.3);
      this.add.text(width - 40, 55, `${GameGlobal.gameData.goldCoins}`, {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#FFD700',
        fontStyle: 'bold'
      });
      
      // 道具列表
      const props = [
        { id: 'detector', imgKey: 'btn_detector', name: '漏洞探测器', desc: '提示当前事件风险等级', price: 600 },
        { id: 'stopLoss', imgKey: 'btn_stopLoss', name: '止损卡', desc: '失败时减少 50% 惩罚', price: 400 },
        { id: 'revert', imgKey: 'btn_revert', name: '撤销卡', desc: '撤销一次错误判断', price: 300 },
        { id: 'doubleGold', imgKey: 'btn_doubleGold', name: '双倍金币卡', desc: '本次金币奖励翻倍', price: 200 },
        { id: 'skip', imgKey: 'btn_skip', name: '跳过卡', desc: '跳过当前事件', price: 150 },
        { id: 'hint', imgKey: 'btn_hint', name: '提示卡', desc: '显示 50% 正确提示', price: 100 }
      ];
      
      let yPos = 120;
      const cardHeight = 85;
      props.forEach(prop => {
        // 道具卡片背景
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 1);
        card.fillRoundedRect(width * 0.1, yPos, width * 0.8, cardHeight, 10);
        card.lineStyle(2, 0x333333);
        card.strokeRoundedRect(width * 0.1, yPos, width * 0.8, cardHeight, 10);
        
        // 道具图标
        this.add.image(width * 0.16, yPos + cardHeight / 2, prop.imgKey).setScale(0.3);
        
        // 道具名称
        this.add.text(width * 0.28, yPos + 10, prop.name, {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#333333',
          fontStyle: 'bold'
        });
        
        // 道具描述
        this.add.text(width * 0.28, yPos + 42, prop.desc, {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#666666'
        });
        
        // 价格
        this.add.image(width * 0.72, yPos + 28, 'icon_gold').setScale(0.18);
        this.add.text(width * 0.75, yPos + 20, `${prop.price}`, {
          fontFamily: 'Arial',
          fontSize: '22px',
          color: '#FFD700',
          fontStyle: 'bold'
        });
        
        // 购买按钮
        const buyBtn = this.add.text(width * 0.85, yPos + 20, '购买', {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#FFFFFF',
          backgroundColor: '#D93A3A',
          padding: { x: 12, y: 6 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        
        buyBtn.on('pointerdown', () => {
          this.buyProp(prop);
        });
        
        yPos += 105;
      });
      
      // 观看广告按钮
      const adBtn = this.add.text(width / 2, height - 150, '📺 观看广告赚金币', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#FFFFFF',
        backgroundColor: '#4CAF50',
        padding: { x: 25, y: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      adBtn.on('pointerdown', () => {
        this.watchAd();
      });
      
      // 返回按钮
      const backBtn = this.add.text(50, 50, '← 返回', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#333333'
      }).setInteractive({ useHandCursor: true });
      
      backBtn.on('pointerdown', () => {
        this.scene.start('LevelSelectScene');
      });
    }
    
    async buyProp(prop) {
      if (GameGlobal.gameData.goldCoins < prop.price) {
        GameGlobal.showAlert('金币不足！');
        return;
      }

      try {
        const result = await GameGlobal.request({
          url: `${GameGlobal.API_BASE}/user/buyProp`,
          method: 'POST',
          data: {
            openid: GameGlobal.gameData.userInfo.openid,
            propId: prop.id,
            propType: prop.id
          }
        });

        if (result.code === 200) {
          GameGlobal.gameData.goldCoins = result.data.newGold;
          GameGlobal.gameData.props = result.data.props;
          GameGlobal.showAlert('购买成功！剩余金币：' + result.data.newGold);
          this.scene.restart();
        } else {
          GameGlobal.showAlert('购买失败：' + result.message);
        }
      } catch (error) {
        console.error('购买错误:', error);
        GameGlobal.showAlert('网络错误，请重试');
      }
    }
    
    async watchAd() {
      if (wx && wx.createRewardedVideoAd) {
        const ad = wx.createRewardedVideoAd({
          adUnitId: 'adunit-xxxxx' // 替换为实际广告 ID
        });
        
        ad.onClose(() => {
          this.rewardAd();
        });
        
        ad.show().catch(() => {
          ad.load().then(() => ad.show());
        });
      } else {
        // 模拟广告观看
        this.rewardAd();
      }
    }
    
    async rewardAd() {
      try {
        const result = await GameGlobal.request({
          url: `${GameGlobal.API_BASE}/ad/watch`,
          method: 'POST',
          data: {
            openid: GameGlobal.gameData.userInfo.openid
          }
        });

        if (result.code === 200) {
          GameGlobal.gameData.goldCoins = result.data.newGold;
          GameGlobal.showAlert('广告观看成功！获得 ' + result.data.goldReward + ' 金币');
          this.scene.restart();
        } else {
          GameGlobal.showAlert(result.message);
        }
      } catch (error) {
        console.error('广告奖励错误:', error);
      }
    }
  }

  /**
   * 帮助场景
   */

  class HelpScene extends Phaser.Scene {
    constructor() {
      super({ key: 'HelpScene' });
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      // 背景
      this.add.image(width / 2, height / 2, 'bg_start').setDisplaySize(width, height);
      
      // 标题
      this.add.text(width / 2, 50, '游戏帮助', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0);
      
      // 帮助内容
      const helpContent = [
        '【游戏玩法】',
        '• 移动角色触发诈骗事件',
        '• 判断事件风险等级：安全/低风险/高风险',
        '• 判断正确获得金币，错误扣除金币',
        '',
        '【通关条件】',
        '• 完成所有事件后金币≥0 即可通关',
        '• 通关解锁新场景和角色等级',
        '',
        '【金币系统】',
        '• 每日登录自动扣除生存成本',
        '• 判断成功奖励 50-150 金币',
        '• 可购买道具或观看广告获取',
        '',
        '【角色成长】',
        '• Lv1 校园新人 → Lv5 社会守护者',
        '• 提升等级解锁更多场景',
        '• 累计识别成功次数决定升级',
        '',
        '【分享助力】',
        '• 金币不足时可分享求助',
        '• 好友阅读科普并答题可获补助',
        '• 每日最多 2 次补助金助力'
      ];
      
      let yPos = 120;
      helpContent.forEach(line => {
        const color = line.startsWith('【') ? '#D93A3A' : (line.startsWith('•') ? '#333333' : '#666666');
        const fontSize = line.startsWith('【') ? '26px' : '22px';
        
        this.add.text(width * 0.1, yPos, line, {
          fontFamily: 'Arial',
          fontSize: fontSize,
          color: color,
          lineSpacing: 10
        });
        
        yPos += line === '' ? 20 : 35;
      });
      
      // 反诈科普入口
      const knowBtn = this.add.text(width / 2, height - 180, '📚 查看反诈知识库', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#FFFFFF',
        backgroundColor: '#4CAF50',
        padding: { x: 25, y: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      knowBtn.on('pointerdown', () => {
        this.showKnowledgeBase();
      });
      
      // 返回按钮
      const backBtn = this.add.text(width / 2, height - 100, '返回', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#FFFFFF',
        backgroundColor: '#333333',
        padding: { x: 40, y: 15 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      backBtn.on('pointerdown', () => {
        this.scene.start('StartScene');
      });
    }
    
    showKnowledgeBase() {
      GameGlobal.showAlert('反诈知识库功能开发中...');
    }
  }

  /**
   * 《忽了个悠》微信小游戏主入口
   * 基于 Phaser.js v3 游戏引擎
   */


  // 全局游戏数据（微信小游戏使用 GameGlobal）
  GameGlobal.gameData = {
    userInfo: null,
    currentScene: null,
    currentLevel: 1,
    events: [],
    goldCoins: 2000,
    roleLevel: 1,
    props: [],
    unlockedScenes: ['校园权限场景', '社交福利场景']
  };

  // API 基础地址
  GameGlobal.API_BASE = 'http://hulegeyou.yiouxiaozhan.top/api';

  // 微信 request 请求封装
  GameGlobal.request = function (options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: options.headers || { 'Content-Type': 'application/json' },
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error('请求失败：' + res.statusCode));
          }
        },
        fail(err) {
          reject(err);
        }
      });
    });
  };

  // 弹窗提示封装（替代 alert，避免直接执行，需要时调用）
  GameGlobal.showAlert = function (content, title) {
    return new Promise((resolve) => {
      wx.showModal({
        title: title || '提示',
        content: content || '',
        showCancel: false,
        success: function () {
          resolve();
        }
      });
    });
  };

  // 游戏配置
  const config = {
    type: Phaser.WEBGL,
    width: 750,
    height: 1334,
    backgroundColor: '#F5F2E9',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
      BootScene,
      StartScene,
      LevelSelectScene,
      GameScene,
      ResultScene,
      ShopScene,
      HelpScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };

  // 启动游戏
  new Phaser.Game(config);

  // 微信小游戏环境初始化
  if (wx && wx.onShareAppMessage) {
    wx.onShareAppMessage(() => {
      return {
        title: '《忽了个悠》反诈闯关，测测你的防骗能力！',
        imageUrlId: '',
        imageUrl: ''
      };
    });
  }

  // 监听小程序切前台事件
  if (wx && wx.onShow) {
    wx.onShow(function () {
      console.log('游戏回到前台');
    });
  }

  console.log('忽了个悠 游戏启动成功');

})();
