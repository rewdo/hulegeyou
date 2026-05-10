/**
 * 启动加载场景
 */

export class BootScene extends Phaser.Scene {
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
    const title = this.add.text(width / 2, height / 2 - 50, '忽了个悠', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#333333',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const subtitle = this.add.text(width / 2, height / 2, '反诈科普·寓教于乐', {
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
    
    // 加载资源（实际项目中替换为真实资源路径）
    // 这里使用占位图形，实际应加载图片资源
    this.load.image('bg_start', 'assets/images/bg_start.png');
    this.load.image('character_default', 'assets/images/character_default.png');
    this.load.image('btn_start', 'assets/images/btn_start.png');
    this.load.image('btn_help', 'assets/images/btn_help.png');
    this.load.image('icon_gold', 'assets/images/icon_gold.png');
    this.load.image('icon_level', 'assets/images/icon_level.png');
    
    // 加载音效
    this.load.audio('bgm_main', 'assets/audio/bgm_main.mp3');
    this.load.audio('sfx_click', 'assets/audio/sfx_click.mp3');
    this.load.audio('sfx_success', 'assets/audio/sfx_success.mp3');
    this.load.audio('sfx_fail', 'assets/audio/sfx_fail.mp3');
  }

  create() {
    // 延迟进入主菜单，确保资源加载完成
    this.time.delayedCall(500, () => {
      this.scene.start('StartScene');
    });
  }
}
