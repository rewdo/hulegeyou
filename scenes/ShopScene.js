/**
 * 商城/背包场景
 */

export class ShopScene extends Phaser.Scene {
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
