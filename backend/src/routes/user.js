/**
 * 用户相关接口
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');

/**
 * 生成唯一 openid（用于测试，实际应从微信获取）
 */
function generateOpenid() {
  return 'test_' + crypto.randomBytes(16).toString('hex');
}

/**
 * 获取或创建用户
 * POST /api/user/login
 */
router.post('/login', async (req, res) => {
  try {
    const { code, openid, nickname, avatar_url } = req.body;
    const userOpenid = openid || generateOpenid();
    
    let users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [userOpenid]);
    
    if (users.length === 0) {
      await db.query(
        `INSERT INTO userInfo (openid, nickname, avatar_url, gold_coins, unlocked_scenes) 
         VALUES (?, ?, ?, 2000, '["校园权限场景","社交福利场景"]')`,
        [userOpenid, nickname || '悠客', avatar_url || '']
      );
      users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [userOpenid]);
    } else {
      await db.query('UPDATE userInfo SET last_login_time = NOW() WHERE openid = ?', [userOpenid]);
    }
    
    const user = users[0];
    const today = new Date().toISOString().split('T')[0];
    const loginRecords = await db.query(
      'SELECT * FROM dailyLoginRecords WHERE openid = ? AND login_date = ?',
      [userOpenid, today]
    );
    
    let deductedGold = 0;
    if (loginRecords.length === 0) {
      const levelCosts = { 1: 30, 2: 50, 3: 80, 4: 120, 5: 150 };
      const baseCost = levelCosts[user.role_level] || 30;
      const isBeginner = user.role_level <= 2;
      deductedGold = isBeginner ? Math.floor(baseCost / 2) : baseCost;
      
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const yesterdayRecords = await db.query(
        'SELECT * FROM dailyLoginRecords WHERE openid = ? AND login_date = ?',
        [userOpenid, yesterday]
      );
      
      if (yesterdayRecords.length === 0) {
        deductedGold += Math.floor(baseCost * 0.5);
      }
      
      if (deductedGold > 0) {
        const newGold = Math.max(0, user.gold_coins - deductedGold);
        await db.query('UPDATE userInfo SET gold_coins = ? WHERE openid = ?', [newGold, userOpenid]);
        await db.query(
          'INSERT INTO dailyLoginRecords (openid, login_date, gold_deducted, is_half_rate) VALUES (?, ?, ?, ?)',
          [userOpenid, today, deductedGold, isBeginner ? 1 : 0]
        );
        user.gold_coins = newGold;
      }
    }
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        ...user,
        deductedGold,
        unlocked_scenes: JSON.parse(user.unlocked_scenes || '[]'),
        props: JSON.parse(user.props || '[]'),
        decorations: JSON.parse(user.decorations || '[]')
      }
    });
  } catch (error) {
    console.error('登录接口错误:', error);
    res.status(500).json({ code: 500, message: '登录失败：' + error.message });
  }
});

/**
 * 获取用户信息
 * GET /api/user/info
 */
router.get('/info', async (req, res) => {
  try {
    const { openid } = req.query;
    if (!openid) {
      return res.status(400).json({ code: 400, message: '缺少 openid 参数' });
    }
    
    const users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [openid]);
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    
    const user = users[0];
    res.json({
      code: 200,
      data: {
        ...user,
        unlocked_scenes: JSON.parse(user.unlocked_scenes || '[]'),
        props: JSON.parse(user.props || '[]'),
        decorations: JSON.parse(user.decorations || '[]')
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ code: 500, message: '获取失败：' + error.message });
  }
});

/**
 * 更新用户数据
 * POST /api/user/update
 */
router.post('/update', async (req, res) => {
  try {
    const { openid, gold_coins, role_level, props, decorations, unlocked_scenes } = req.body;
    if (!openid) {
      return res.status(400).json({ code: 400, message: '缺少 openid 参数' });
    }
    
    const updates = [];
    const params = [];
    
    if (gold_coins !== undefined) { updates.push('gold_coins = ?'); params.push(gold_coins); }
    if (role_level !== undefined) { updates.push('role_level = ?'); params.push(role_level); }
    if (props !== undefined) { updates.push('props = ?'); params.push(JSON.stringify(props)); }
    if (decorations !== undefined) { updates.push('decorations = ?'); params.push(JSON.stringify(decorations)); }
    if (unlocked_scenes !== undefined) { updates.push('unlocked_scenes = ?'); params.push(JSON.stringify(unlocked_scenes)); }
    
    if (updates.length === 0) {
      return res.status(400).json({ code: 400, message: '没有要更新的数据' });
    }
    
    params.push(openid);
    await db.query(`UPDATE userInfo SET ${updates.join(', ')} WHERE openid = ?`, params);
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    console.error('更新用户数据错误:', error);
    res.status(500).json({ code: 500, message: '更新失败：' + error.message });
  }
});

/**
 * 购买道具
 * POST /api/user/buyProp
 */
router.post('/buyProp', async (req, res) => {
  try {
    const { openid, propId, propType } = req.body;
    if (!openid || !propId) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    const propPrices = { 'detector': 600, 'stopLoss': 400, 'revert': 300 };
    const price = propPrices[propType];
    if (!price) {
      return res.status(400).json({ code: 400, message: '未知道具类型' });
    }
    
    const users = await db.query('SELECT gold_coins, props FROM userInfo WHERE openid = ?', [openid]);
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    
    const user = users[0];
    if (user.gold_coins < price) {
      return res.status(400).json({ code: 400, message: '金币不足' });
    }
    
    const newGold = user.gold_coins - price;
    const props = JSON.parse(user.props || '[]');
    props.push({ id: propId, type: propType, buyTime: new Date().toISOString() });
    
    await db.query('UPDATE userInfo SET gold_coins = ?, props = ? WHERE openid = ?', [newGold, JSON.stringify(props), openid]);
    
    res.json({ code: 200, message: '购买成功', data: { newGold, props } });
  } catch (error) {
    console.error('购买道具错误:', error);
    res.status(500).json({ code: 500, message: '购买失败：' + error.message });
  }
});

module.exports = router;
