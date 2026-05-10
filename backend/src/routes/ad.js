/**
 * 广告相关接口
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 记录广告观看
 * POST /api/ad/watch
 */
router.post('/watch', async (req, res) => {
  try {
    const { openid, adUnitId } = req.body;
    if (!openid) {
      return res.status(400).json({ code: 400, message: '缺少 openid 参数' });
    }
    
    // 查询用户等级
    const users = await db.query('SELECT gold_coins, role_level FROM userInfo WHERE openid = ?', [openid]);
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    
    const user = users[0];
    
    // 检查金币是否小于 500（广告触发条件）
    if (user.gold_coins >= 500) {
      return res.status(400).json({ code: 400, message: '金币充足，无需观看广告' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // 查询今日观看记录
    let adRecords = await db.query(
      'SELECT * FROM adWatchRecords WHERE openid = ? AND watch_date = ?',
      [openid, today]
    );
    
    if (adRecords.length === 0) {
      // 首次观看，创建记录
      const reward = getAdReward(user.role_level);
      await db.query(
        `INSERT INTO adWatchRecords (openid, watch_date, watch_count, gold_rewarded, last_watch_time)
         VALUES (?, ?, 1, ?, ?)`,
        [openid, today, reward, now]
      );
      
      // 发放奖励
      await db.query('UPDATE userInfo SET gold_coins = gold_coins + ? WHERE openid = ?', [reward, openid]);
      
      res.json({
        code: 200,
        message: '广告观看成功',
        data: {
          goldReward: reward,
          newGold: user.gold_coins + reward,
          todayCount: 1,
          maxCount: 3
        }
      });
    } else {
      const record = adRecords[0];
      
      // 检查观看次数
      if (record.watch_count >= 3) {
        return res.status(400).json({ code: 400, message: '今日观看次数已达上限' });
      }
      
      // 检查间隔（30 分钟）
      const lastWatchTime = new Date(record.last_watch_time);
      const minutesDiff = (now - lastWatchTime) / 60000;
      
      if (minutesDiff < 30) {
        return res.status(400).json({
          code: 400,
          message: `请等待${Math.ceil(30 - minutesDiff)}分钟后再观看`
        });
      }
      
      // 更新记录
      const reward = getAdReward(user.role_level);
      const newCount = record.watch_count + 1;
      
      await db.query(
        `UPDATE adWatchRecords 
         SET watch_count = ?, gold_rewarded = gold_rewarded + ?, last_watch_time = ?
         WHERE openid = ? AND watch_date = ?`,
        [newCount, reward, now, openid, today]
      );
      
      // 发放奖励
      await db.query('UPDATE userInfo SET gold_coins = gold_coins + ? WHERE openid = ?', [reward, openid]);
      
      res.json({
        code: 200,
        message: '广告观看成功',
        data: {
          goldReward: reward,
          newGold: user.gold_coins + reward,
          todayCount: newCount,
          maxCount: 3
        }
      });
    }
  } catch (error) {
    console.error('广告观看错误:', error);
    res.status(500).json({ code: 500, message: '观看失败：' + error.message });
  }
});

/**
 * 获取广告配置
 * GET /api/ad/config
 */
router.get('/config', async (req, res) => {
  try {
    const { openid } = req.query;
    
    let adConfig = {
      enabled: true,
      unitId: process.env.AD_UNIT_ID || 'adunit-default',
      rewardRules: {
        '1-2': 250,
        '3-4': 200,
        '5': 150
      },
      maxWatchPerDay: 3,
      minIntervalMinutes: 30,
      triggerGoldThreshold: 500
    };
    
    if (openid) {
      const users = await db.query('SELECT role_level, gold_coins FROM userInfo WHERE openid = ?', [openid]);
      if (users.length > 0) {
        const user = users[0];
        adConfig.canWatch = user.gold_coins < 500;
        adConfig.userLevel = user.role_level;
        adConfig.currentReward = getAdReward(user.role_level);
      }
    }
    
    res.json({
      code: 200,
      data: adConfig
    });
  } catch (error) {
    console.error('获取广告配置错误:', error);
    res.status(500).json({ code: 500, message: '获取失败：' + error.message });
  }
});

/**
 * 根据等级计算广告奖励
 */
function getAdReward(roleLevel) {
  if (roleLevel <= 2) return 250;
  if (roleLevel <= 4) return 200;
  return 150;
}

module.exports = router;
