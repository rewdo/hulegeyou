/**
 * 游戏启动页场景
 */

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0xF5F2E9);
    
    // 墨痕装饰（简化版，实际应使用图片）
    const inkDecor = this.add.graphics();
    inkDecor.fillStyle(0x333333, 0.1);
    inkDecor.fillCircle(width * 0.2, height * 0.3, 100);
    inkDecor.fillCircle(width * 0.8, height * 0.7, 150);
    
    // 游戏标题
    const title = this.add.text(width / 2, height * 0.25, '忽了个悠', {
      fontFamily: 'Arial',
      fontSize: '72px',
      color: '#333333',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 副标题
    const subtitle = this.add.text(width / 2, height * 0.32, '反诈科普·寓教于乐', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#666666'
    }).setOrigin(0.5);
    
    // 简笔画角色（占位，实际应使用图片）
    const character = this.add.graphics();
    character.fillStyle(0x333333, 1);
    character.fillCircle(width / 2, height * 0.45, 60); // 头
    character.fillRect(width / 2 - 40, height * 0.52, 80, 100); // 身体
    
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
    const footer = this.add.text(width / 2, height - 50, '反诈科普·寓教于乐', {
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
