/**
 * 全局游戏数据管理器
 * 替代 Phaser registry，管理关卡、金币、用户信息等
 */

let instance;

class DataBus {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.goldCoins = 2000;
    this.roleLevel = 1;
    this.props = [];
    this.unlockedScenes = ['校园权限场景', '社交福利场景'];
    this.userInfo = null;
    this.currentScene = null;
    this.currentLevel = 1;
    this.events = [];
    this.totalSuccess = 0;
    this.totalFails = 0;
  }

  /** 重置关卡相关数据（保留用户信息） */
  resetLevel() {
    this.events = [];
    this.currentLevel = 1;
    this.currentScene = null;
  }

  /** 从后端返回的用户数据同步 */
  syncFromUser(data) {
    if (!data) return;
    this.goldCoins = data.gold_coins || 2000;
    this.roleLevel = data.role_level || 1;
    this.unlockedScenes = data.unlocked_scenes || [];
    this.props = data.props || [];
  }

  /** 加载离线默认数据 */
  loadOffline() {
    this.userInfo = {
      openid: 'offline_user',
      nickname: '悠客',
      gold_coins: 2000,
      role_level: 1,
      unlocked_scenes: ['校园权限场景', '社交福利场景']
    };
    this.syncFromUser(this.userInfo);
  }
}

export default DataBus;
