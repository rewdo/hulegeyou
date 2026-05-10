# 《忽了个悠》运营文档

## 一、新增风险事件指南

### 1.1 事件模板

所有风险事件必须按以下 6 类模板设计：

#### 按键类事件
```sql
INSERT INTO riskEvents (
  event_id, event_type, fraud_type, briskly_point, risk_level, scene_type,
  min_role_level, title, content, style_config, button_config,
  cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id
) VALUES (
  'NEW001', '按键类', '虚假购物投资诈骗', 'Low-cost', 2, '二手交易场景',
  1, '事件标题', '事件描述内容',
  '{"type":"button","style":"poster","text":"按钮文案"}',
  '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}',
  0, 100, 50, 0.3, 1
);
```

#### 社交聊天类事件
```sql
INSERT INTO riskEvents (
  event_id, event_type, fraud_type, briskly_point, risk_level, scene_type,
  min_role_level, title, content, style_config, button_config,
  cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id
) VALUES (
  'CHAT001', '社交聊天类', '交友恋爱诈骗', 'Kickback', 3, '社交福利场景',
  2, '网恋推荐投资', '认识两周的"完美恋人"推荐投资平台...',
  '{"type":"chat","avatar":"lover_fake","bg":"romantic_bg"}',
  '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}',
  5000, 150, 5000, 0.6, 3
);
```

### 1.2 BRISKLY 风险模型绑定

每个事件必须关联至少 1 个 BRISKLY 风险点：

| 代码 | 含义 | 说明 |
|------|------|------|
| Broadcast | 未经授权传播 | 消息被未授权传播 |
| Repudiation | 可抵赖行为 | 行为无法追溯 |
| Information | 信息泄露 | 个人信息被窃取 |
| Spoofing | 顶替冒充 | 冒充他人身份 |
| Kickback | 金钱收益 | 涉及金钱诱惑 |
| Low-cost | 低犯罪成本 | 诈骗成本低 |
| Yank | 引流性质 | 诱导点击/转账 |

### 1.3 批量导入 Excel 模板

创建 `events_import.xlsx`，包含以下列：

| event_id | event_type | fraud_type | briskly_point | risk_level | scene_type | title | content | cost_invest | anti_fraud_id |
|----------|------------|------------|---------------|------------|------------|-------|---------|-------------|---------------|
| NEW001 | 按键类 | 虚假购物投资诈骗 | Low-cost | 2 | 二手交易场景 | 超低价手机 | 二手平台看到... | 2000 | 4 |

使用脚本转换 Excel 为 SQL:
```bash
node utils/excel-to-sql.js events_import.xlsx > new_events.sql
mysql -u root -p huolegeyou < new_events.sql
```

---

## 二、反诈科普内容规范

### 2.1 科普文案要求

- **字数**: 100-150 字
- **结构**: 风险揭示 + 识别方法 + 防范建议
- **语言**: 通俗易懂，避免专业术语
- **格式**: 3-4 句话，朗朗上口

**示例:**
> 公检法机关不会通过电话、QQ、微信等社交工具办案，更不会要求转账到"安全账户"。凡是自称公检法要求转账的都是诈骗！记住：真警察不会电话办案，安全账户不存在，转账要求必是诈。

### 2.2 验证题目设计

- **题型**: 单选题，4 个选项
- **难度**: 初中及以上可答对
- **来源**: 必须出自科普内容
- **答案**: 明确无争议

**示例:**
```json
{
  "question": "公检法机关会通过什么方式要求你转账到安全账户？",
  "options": [
    "A. 电话通知",
    "B. 微信联系",
    "C. 从来不会",
    "D. QQ 告知"
  ],
  "answer": "C"
}
```

---

## 三、活动运营建议

### 3.1 新手引导活动

**目标**: 提高新用户留存
**方案**:
- 新手期 (Lv1-Lv2) 金币扣除减半
- 首次通关额外奖励 500 金币
- 前 3 次失败赠送撤销卡

### 3.2 分享裂变活动

**目标**: 扩大用户规模
**方案**:
- 分享 3 位好友解锁限定装饰
- 好友助力双倍奖励 (限时)
- 邀请排行榜，前 10 名奖励

### 3.3 节日主题活动

**目标**: 提高活跃度
**方案**:
- 反诈宣传日 (12 月 4 日) 专题活动
- 春节/国庆限定场景
- 开学季校园反诈专题

---

## 四、数据分析指标

### 4.1 核心指标

| 指标 | 计算公式 | 目标值 |
|------|----------|--------|
| DAU | 日活跃用户数 | 1000+ |
| 次日留存 | 次日登录用户/新增用户 | 40%+ |
| 平均通关率 | 通关次数/总游戏次数 | 60%+ |
| 平均游戏时长 | 总游戏时长/活跃用户 | 5min+ |
| 分享率 | 分享用户/活跃用户 | 15%+ |

### 4.2 分析 SQL

```sql
-- 日活跃用户趋势
SELECT DATE(created_at) as date, COUNT(DISTINCT openid) as dau
FROM gameRecords
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date;

-- 关卡难度分析
SELECT scene_type, AVG(result) as pass_rate, AVG(duration) as avg_duration
FROM gameRecords
GROUP BY scene_type;

-- 事件错误率排行
SELECT e.event_id, e.title, COUNT(*) as total,
       SUM(CASE WHEN g.result = 0 THEN 1 ELSE 0 END) as fail_count
FROM gameRecords g
JOIN riskEvents e ON g.scene_type = e.scene_type
GROUP BY e.event_id
ORDER BY fail_count DESC
LIMIT 10;
```

---

## 五、内容审核规范

### 5.1 审核要点

1. **政治正确**: 不涉及敏感政治内容
2. **真实性**: 诈骗案例基于真实事件改编
3. **教育性**: 科普内容准确无误
4. **趣味性**: 玩法有趣，不枯燥说教

### 5.2 禁止内容

- ❌ 涉及黄赌毒内容
- ❌ 歧视性言论
- ❌ 过度恐怖/暴力
- ❌ 虚假广告信息
- ❌ 侵权内容

---

## 六、用户反馈处理

### 6.1 反馈渠道

- 游戏内"意见反馈"入口
- 微信公众号留言
- 客服邮箱：support@yiouxiaozhan.top

### 6.2 响应时效

| 问题类型 | 响应时间 | 处理时间 |
|----------|----------|----------|
| 严重 BUG | 2 小时内 | 24 小时内 |
| 一般问题 | 24 小时内 | 3 个工作日内 |
| 建议反馈 | 48 小时内 | 评估后回复 |

---

**持续优化，让反诈知识传播更广泛！📚**
