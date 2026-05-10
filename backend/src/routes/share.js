/**
 * 分享助力相关接口
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 创建分享记录
 * POST /api/share/create
 */
router.post('/create', async (req, res) => {
  try {
    const { openid, helpType } = req.body;
    if (!openid || !helpType) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    // 检查今日分享次数
    const today = new Date().toISOString().split('T')[0];
    const isBonusType = helpType === 1; // 1=补助金 2=豁免惩罚
    
    const records = await db.query(
      `SELECT COUNT(*) as count FROM shareHelpRecords 
       WHERE share_openid = ? AND DATE(created_at) = ? AND help_type = ?`,
      [openid, today, helpType]
    );
    
    const maxTimes = isBonusType ? 2 : 1;
    if (records[0].count >= maxTimes) {
      return res.status(400).json({ code: 400, message: '今日分享次数已达上限' });
    }
    
    // 生成分享 ID
    const shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.json({
      code: 200,
      message: '分享创建成功',
      data: {
        shareId,
        shareUrl: `https://www.yiouxiaozhan.top/share/${shareId}`,
        helpType,
        maxTimes,
        usedTimes: records[0].count + 1
      }
    });
  } catch (error) {
    console.error('创建分享错误:', error);
    res.status(500).json({ code: 500, message: '创建失败：' + error.message });
  }
});

/**
 * 助力完成
 * POST /api/share/help
 */
router.post('/help', async (req, res) => {
  try {
    const { shareId, helpOpenid, answerCorrect } = req.body;
    if (!shareId || !helpOpenid || answerCorrect === undefined) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    // 查询分享记录
    const shares = await db.query(
      'SELECT * FROM shareHelpRecords WHERE id = (SELECT MAX(id) FROM shareHelpRecords WHERE share_openid LIKE ?)',
      ['%' + shareId.split('_')[1] + '%']
    );
    
    // 检查答案是否正确
    if (!answerCorrect) {
      return res.status(400).json({ code: 400, message: '答题错误，助力失败' });
    }
    
    // 获取分享者信息
    const shareRecords = await db.query(
      'SELECT * FROM shareHelpRecords WHERE share_openid LIKE ? ORDER BY created_at DESC LIMIT 1',
      ['%' + shareId.split('_')[1] + '%']
    );
    
    if (shareRecords.length === 0) {
      return res.status(404).json({ code: 404, message: '分享记录不存在' });
    }
    
    const shareRecord = shareRecords[0];
    const shareOpenid = shareRecord.share_openid;
    
    // 检查是否已助力过
    const helpRecords = await db.query(
      'SELECT * FROM shareHelpRecords WHERE share_openid = ? AND help_openid = ?',
      [shareOpenid, helpOpenid]
    );
    
    if (helpRecords.length > 0) {
      return res.status(400).json({ code: 400, message: '您已助力过该用户' });
    }
    
    // 创建助力记录
    const goldReward = shareRecord.gold_reward || 200;
    await db.query(
      `INSERT INTO shareHelpRecords (share_openid, help_openid, help_type, gold_reward, is_completed)
       VALUES (?, ?, ?, ?, 1)`,
      [shareOpenid, helpOpenid, shareRecord.help_type, goldReward]
    );
    
    // 给分享者发放奖励
    await db.query('UPDATE userInfo SET gold_coins = gold_coins + ? WHERE openid = ?', [goldReward, shareOpenid]);
    
    // 增加科普助力次数
    await db.query('UPDATE antiFraudKnow SET help_count = help_count + 1 WHERE id = ?', [shareRecord.knowledge_id || 1]);
    
    res.json({
      code: 200,
      message: '助力成功',
      data: {
        goldReward,
        shareOpenid
      }
    });
  } catch (error) {
    console.error('助力错误:', error);
    res.status(500).json({ code: 500, message: '助力失败：' + error.message });
  }
});

/**
 * 检查助力状态
 * GET /api/share/status/:shareId
 */
router.get('/status/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const records = await db.query(
      'SELECT * FROM shareHelpRecords WHERE share_openid LIKE ? ORDER BY created_at DESC',
      ['%' + shareId.split('_')[1] + '%']
    );
    
    if (records.length === 0) {
      return res.status(404).json({ code: 404, message: '分享记录不存在' });
    }
    
    const record = records[0];
    res.json({
      code: 200,
      data: {
        isCompleted: record.is_completed === 1,
        helpType: record.help_type,
        goldReward: record.gold_reward
      }
    });
  } catch (error) {
    console.error('检查助力状态错误:', error);
    res.status(500).json({ code: 500, message: '查询失败：' + error.message });
  }
});

module.exports = router;
