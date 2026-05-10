/**
 * 游戏相关接口
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 开始关卡
 * POST /api/game/start
 */
router.post('/start', async (req, res) => {
  try {
    const { openid, sceneType, level } = req.body;
    if (!openid || !sceneType) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    // 查询用户
    const users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [openid]);
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    const user = users[0];
    
    // 检查场景是否解锁
    const unlockedScenes = JSON.parse(user.unlocked_scenes || '[]');
    if (!unlockedScenes.includes(sceneType)) {
      return res.status(403).json({ code: 403, message: '场景未解锁' });
    }
    
    // 获取该场景的随机事件（5-8 个）
    const eventCount = Math.floor(Math.random() * 4) + 5;
    const events = await db.query(
      `SELECT * FROM riskEvents 
       WHERE scene_type = ? AND is_active = 1 AND min_role_level <= ?
       ORDER BY RAND() LIMIT ?`,
      [sceneType, user.role_level, eventCount]
    );
    
    if (events.length === 0) {
      return res.status(400).json({ code: 400, message: '该场景暂无可用事件' });
    }
    
    // 生成游戏会话
    const sessionData = {
      sceneType,
      level,
      events: events.map(e => ({
        eventId: e.event_id,
        title: e.title,
        content: e.content,
        costInvest: e.cost_invest,
        styleConfig: JSON.parse(e.style_config || '{}'),
        buttonConfig: JSON.parse(e.button_config || '{}')
      })),
      startGold: user.gold_coins,
      startTime: new Date().toISOString()
    };
    
    res.json({
      code: 200,
      message: '关卡开始',
      data: {
        session: sessionData,
        userGold: user.gold_coins,
        eventCount: events.length
      }
    });
  } catch (error) {
    console.error('开始关卡错误:', error);
    res.status(500).json({ code: 500, message: '开始失败：' + error.message });
  }
});

/**
 * 提交事件判断
 * POST /api/game/submitEvent
 */
router.post('/submitEvent', async (req, res) => {
  try {
    const { openid, eventId, userChoice, investedGold } = req.body;
    if (!openid || !eventId || userChoice === undefined) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    // 查询事件
    const events = await db.query('SELECT * FROM riskEvents WHERE event_id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ code: 404, message: '事件不存在' });
    }
    const event = events[0];
    
    // 查询用户
    const users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [openid]);
    const user = users[0];
    
    // 判断是否正确
    const isSuccess = userChoice === event.risk_level;
    let goldChange = 0;
    let finalGold = user.gold_coins;
    
    // 扣除尝试成本
    const levelCosts = { 1: 5, 2: 8, 3: 10, 4: 15, 5: 20 };
    const tryCost = levelCosts[user.role_level] || 5;
    finalGold -= tryCost;
    goldChange -= tryCost;
    
    if (isSuccess) {
      // 成功：奖励金币
      const reward = event.success_reward;
      finalGold += reward;
      goldChange += reward;
      
      // 如果投入了金币，返还并加收益
      if (investedGold > 0) {
        finalGold += investedGold;
        goldChange += investedGold;
      }
      
      // 更新成功次数
      await db.query(
        'UPDATE userInfo SET gold_coins = ?, total_success_count = total_success_count + 1 WHERE openid = ?',
        [finalGold, openid]
      );
    } else {
      // 失败：扣除投入和惩罚
      if (investedGold > 0) {
        finalGold -= investedGold;
        goldChange -= investedGold;
      }
      
      const penalty = Math.floor(investedGold * event.fail_penalty_rate);
      finalGold -= penalty;
      goldChange -= penalty;
      
      // 更新失败次数
      await db.query(
        'UPDATE userInfo SET gold_coins = ?, total_fail_count = total_fail_count + 1 WHERE openid = ?',
        [Math.max(0, finalGold), openid]
      );
    }
    
    // 获取科普内容
    const knowledges = await db.query('SELECT * FROM antiFraudKnow WHERE id = ?', [event.anti_fraud_id]);
    const knowledge = knowledges[0];
    
    res.json({
      code: 200,
      message: isSuccess ? '判断正确！' : '判断错误',
      data: {
        isSuccess,
        goldChange,
        newGold: Math.max(0, finalGold),
        correctRisk: event.risk_level,
        knowledge: knowledge ? {
          title: knowledge.title,
          content: knowledge.content,
          verifyQuestion: JSON.parse(knowledge.verify_question)
        } : null
      }
    });
  } catch (error) {
    console.error('提交事件错误:', error);
    res.status(500).json({ code: 500, message: '提交失败：' + error.message });
  }
});

/**
 * 完成关卡
 * POST /api/game/finish
 */
router.post('/finish', async (req, res) => {
  try {
    const { openid, sceneType, level, eventsTotal, eventsSuccess, goldChange, result, duration } = req.body;
    if (!openid || !sceneType) {
      return res.status(400).json({ code: 400, message: '参数不完整' });
    }
    
    // 记录游戏结果
    await db.query(
      `INSERT INTO gameRecords (openid, scene_type, level, events_total, events_success, gold_change, result, duration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [openid, sceneType, level || 1, eventsTotal, eventsSuccess, goldChange, result ? 1 : 0, duration || 0]
    );
    
    // 如果通关，检查是否升级
    const users = await db.query('SELECT * FROM userInfo WHERE openid = ?', [openid]);
    const user = users[0];
    
    let levelUp = false;
    let newUnlockedScenes = JSON.parse(user.unlocked_scenes || '[]');
    
    if (result) {
      // 通关奖励
      const bonus = 100;
      await db.query('UPDATE userInfo SET gold_coins = gold_coins + ? WHERE openid = ?', [bonus, openid]);
      
      // 检查升级条件
      const levelConditions = [
        { level: 2, successCount: 25, scenes: ['校园兼职场景', '二手交易场景'] },
        { level: 3, successCount: 40, scenes: ['租房场景', '消费维权场景'] },
        { level: 4, successCount: 60, scenes: ['职场入职场景', '基础金融场景'] },
        { level: 5, successCount: 80, scenes: ['法律合同场景', '高端诈骗场景'] }
      ];
      
      for (const cond of levelConditions) {
        if (user.role_level < cond.level && user.total_success_count >= cond.successCount) {
          await db.query(
            'UPDATE userInfo SET role_level = ?, role_identity = ? WHERE openid = ?',
            [cond.level, ['兼职探索者', '生活达人', '职场预备役', '社会守护者'][cond.level - 2], openid]
          );
          
          cond.scenes.forEach(s => {
            if (!newUnlockedScenes.includes(s)) newUnlockedScenes.push(s);
          });
          
          await db.query('UPDATE userInfo SET unlocked_scenes = ? WHERE openid = ?', [JSON.stringify(newUnlockedScenes), openid]);
          levelUp = true;
          break;
        }
      }
    }
    
    res.json({
      code: 200,
      message: '关卡完成',
      data: { levelUp, newUnlockedScenes }
    });
  } catch (error) {
    console.error('完成关卡错误:', error);
    res.status(500).json({ code: 500, message: '完成失败：' + error.message });
  }
});

module.exports = router;
