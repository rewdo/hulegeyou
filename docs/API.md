# 《忽了个悠》API 接口文档

## 基础信息

- **基础 URL**: `https://www.yiouxiaozhan.top/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 用户接口

### 1. 用户登录

**POST** `/user/login`

**请求参数:**
```json
{
  "code": "微信登录 code",
  "openid": "用户 openid (可选)",
  "nickname": "用户昵称",
  "avatar_url": "头像 URL"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "id": 1,
    "openid": "test_xxx",
    "nickname": "悠客",
    "gold_coins": 2000,
    "role_level": 1,
    "role_identity": "校园新人",
    "unlocked_scenes": ["校园权限场景", "社交福利场景"],
    "props": [],
    "decorations": [],
    "deductedGold": 15
  }
}
```

### 2. 获取用户信息

**GET** `/user/info?openid=xxx`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "openid": "test_xxx",
    "gold_coins": 1985,
    "role_level": 1,
    "total_success_count": 10,
    "unlocked_scenes": ["校园权限场景", "社交福利场景"]
  }
}
```

### 3. 更新用户数据

**POST** `/user/update`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "gold_coins": 2000,
  "role_level": 2,
  "props": [{"id": "detector", "type": "detector"}],
  "unlocked_scenes": ["校园权限场景", "社交福利场景", "校园兼职场景"]
}
```

### 4. 购买道具

**POST** `/user/buyProp`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "propId": "detector_001",
  "propType": "detector"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "购买成功",
  "data": {
    "newGold": 1400,
    "props": [{"id": "detector_001", "type": "detector", "buyTime": "2026-04-15T10:00:00.000Z"}]
  }
}
```

---

## 游戏接口

### 5. 开始关卡

**POST** `/game/start`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "sceneType": "校园权限场景",
  "level": 1
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "关卡开始",
  "data": {
    "session": {
      "sceneType": "校园权限场景",
      "level": 1,
      "events": [
        {
          "eventId": "GJF001",
          "title": "警察来电",
          "content": "【微信来电】...",
          "costInvest": 0,
          "styleConfig": {},
          "buttonConfig": {}
        }
      ],
      "startGold": 2000,
      "startTime": "2026-04-15T10:00:00.000Z"
    },
    "userGold": 2000,
    "eventCount": 6
  }
}
```

### 6. 提交事件判断

**POST** `/game/submitEvent`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "eventId": "GJF001",
  "userChoice": 3,
  "investedGold": 0
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "判断正确！",
  "data": {
    "isSuccess": true,
    "goldChange": 145,
    "newGold": 2145,
    "correctRisk": 3,
    "knowledge": {
      "title": "冒充公检法诈骗揭秘",
      "content": "公检法机关不会通过电话...",
      "verifyQuestion": {
        "question": "公检法机关会通过什么方式要求你转账？",
        "options": ["A. 电话通知", "B. 微信联系", "C. 从来不会", "D. QQ 告知"],
        "answer": "C"
      }
    }
  }
}
```

### 7. 完成关卡

**POST** `/game/finish`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "sceneType": "校园权限场景",
  "level": 1,
  "eventsTotal": 6,
  "eventsSuccess": 5,
  "goldChange": 100,
  "result": true,
  "duration": 180
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "关卡完成",
  "data": {
    "levelUp": false,
    "newUnlockedScenes": ["校园权限场景", "社交福利场景"]
  }
}
```

---

## 事件接口

### 8. 获取事件列表

**GET** `/event/list?sceneType=校园权限场景&riskLevel=3`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "event_id": "GJF001",
      "event_type": "社交聊天类",
      "fraud_type": "冒充公检法诈骗",
      "risk_level": 3,
      "title": "警察来电",
      "content": "...",
      "styleConfig": {},
      "buttonConfig": {}
    }
  ]
}
```

### 9. 获取事件详情

**GET** `/event/detail/:eventId`

### 10. 获取科普内容

**GET** `/event/knowledge/:id`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "冒充公检法诈骗揭秘",
    "content": "公检法机关不会通过电话...",
    "verifyQuestion": {
      "question": "...",
      "options": [...],
      "answer": "C"
    },
    "view_count": 100
  }
}
```

---

## 分享接口

### 11. 创建分享

**POST** `/share/create`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "helpType": 1
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "分享创建成功",
  "data": {
    "shareId": "share_1234567890_abc",
    "shareUrl": "https://www.yiouxiaozhan.top/share/share_1234567890_abc",
    "helpType": 1,
    "maxTimes": 2,
    "usedTimes": 1
  }
}
```

### 12. 助力完成

**POST** `/share/help`

**请求参数:**
```json
{
  "shareId": "share_1234567890_abc",
  "helpOpenid": "helper_xxx",
  "answerCorrect": true
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "助力成功",
  "data": {
    "goldReward": 200,
    "shareOpenid": "test_xxx"
  }
}
```

### 13. 检查助力状态

**GET** `/share/status/:shareId`

---

## 广告接口

### 14. 记录广告观看

**POST** `/ad/watch`

**请求参数:**
```json
{
  "openid": "test_xxx",
  "adUnitId": "adunit-xxx"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "广告观看成功",
  "data": {
    "goldReward": 250,
    "newGold": 2250,
    "todayCount": 1,
    "maxCount": 3
  }
}
```

### 15. 获取广告配置

**GET** `/ad/config?openid=test_xxx`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "enabled": true,
    "unitId": "adunit-xxx",
    "rewardRules": {
      "1-2": 250,
      "3-4": 200,
      "5": 150
    },
    "maxWatchPerDay": 3,
    "minIntervalMinutes": 30,
    "triggerGoldThreshold": 500,
    "canWatch": true,
    "userLevel": 1,
    "currentReward": 250
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 403 | 权限不足/场景未解锁 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 限流说明

- 所有接口：100 次请求/15 分钟/IP
- 超过限制返回：`{"code": 429, "message": "请求过于频繁，请稍后再试"}`
