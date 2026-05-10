/**
 * 风险事件相关接口
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 获取事件列表
 * GET /api/event/list
 */
router.get('/list', async (req, res) => {
  try {
    const { sceneType, fraudType, riskLevel, minRoleLevel } = req.query;
    
    let sql = 'SELECT * FROM riskEvents WHERE is_active = 1';
    const params = [];
    
    if (sceneType) {
      sql += ' AND scene_type = ?';
      params.push(sceneType);
    }
    if (fraudType) {
      sql += ' AND fraud_type = ?';
      params.push(fraudType);
    }
    if (riskLevel) {
      sql += ' AND risk_level = ?';
      params.push(riskLevel);
    }
    if (minRoleLevel) {
      sql += ' AND min_role_level <= ?';
      params.push(minRoleLevel);
    }
    
    sql += ' ORDER BY sort_order, created_at DESC';
    
    const events = await db.query(sql, params);
    
    res.json({
      code: 200,
      data: events.map(e => ({
        ...e,
        styleConfig: JSON.parse(e.style_config || '{}'),
        buttonConfig: JSON.parse(e.button_config || '{}')
      }))
    });
  } catch (error) {
    console.error('获取事件列表错误:', error);
    res.status(500).json({ code: 500, message: '获取失败：' + error.message });
  }
});

/**
 * 获取单个事件详情
 * GET /api/event/detail/:eventId
 */
router.get('/detail/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const events = await db.query('SELECT * FROM riskEvents WHERE event_id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ code: 404, message: '事件不存在' });
    }
    
    const event = events[0];
    const knowledges = await db.query('SELECT * FROM antiFraudKnow WHERE id = ?', [event.anti_fraud_id]);
    
    res.json({
      code: 200,
      data: {
        ...event,
        styleConfig: JSON.parse(event.style_config || '{}'),
        buttonConfig: JSON.parse(event.button_config || '{}'),
        knowledge: knowledges[0] || null
      }
    });
  } catch (error) {
    console.error('获取事件详情错误:', error);
    res.status(500).json({ code: 500, message: '获取失败：' + error.message });
  }
});

/**
 * 获取科普内容
 * GET /api/event/knowledge/:id
 */
router.get('/knowledge/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const knowledges = await db.query('SELECT * FROM antiFraudKnow WHERE id = ?', [id]);
    if (knowledges.length === 0) {
      return res.status(404).json({ code: 404, message: '科普内容不存在' });
    }
    
    // 增加阅读次数
    await db.query('UPDATE antiFraudKnow SET view_count = view_count + 1 WHERE id = ?', [id]);
    
    const knowledge = knowledges[0];
    res.json({
      code: 200,
      data: {
        ...knowledge,
        verifyQuestion: JSON.parse(knowledge.verify_question)
      }
    });
  } catch (error) {
    console.error('获取科普内容错误:', error);
    res.status(500).json({ code: 500, message: '获取失败：' + error.message });
  }
});

module.exports = router;
