/**
 * 关卡结果场景
 */

export class ResultScene extends Phaser.Scene {
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
    
    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, this.isPass ? 0xE8F5E9 : 0xFFEBEE);
    
    // 结果图标
    const icon = this.isPass ? '🎉' : '😢';
    const resultText = this.isPass ? '闯关成功！' : '闯关失败';
    const color = this.isPass ? 0x4CAF50 : 0xF44336;
    
    this.add.text(width / 2, height * 0.25, `${icon}`, { fontSize: '100px' }).setOrigin(0.5);
    
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
