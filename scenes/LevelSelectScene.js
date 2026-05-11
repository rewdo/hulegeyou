/**
 * 关卡选择场景
 */

export class LevelSelectScene extends Phaser.Scene {
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
    const title = this.add.text(width / 2, height * 0.15, '选择关卡', {
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
    const goldText = this.add.text(85, 40, `${GameGlobal.gameData.goldCoins}`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    // 等级图标 + 等级
    this.add.image(width - 140, 50, 'icon_level').setScale(0.25);
    const levelText = this.add.text(width - 115, 40, `Lv.${GameGlobal.gameData.roleLevel}`, {
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
      const nameText = this.add.text(width * 0.15, yPos + 25, scene.name, {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: scene.locked ? '#999999' : '#333333'
      });
      
      // 等级要求
      if (scene.locked) {
        const lockText = this.add.text(width * 0.85, yPos + 25, `🔒 Lv.${scene.level}`, {
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
