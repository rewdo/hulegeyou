/**
 * 帮助场景
 */

export class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HelpScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0xF5F2E9);
    
    // 标题
    this.add.text(width / 2, 50, '📖 游戏帮助', {
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
