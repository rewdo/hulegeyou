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
