# 《忽了个悠》反诈主题休闲闯关微信小游戏

> 寓教于乐的反诈科普游戏，让防骗知识学习变得更有趣！

---

## 📖 项目简介

《忽了个悠》是一款以电信网络诈骗风险识别为主题的休闲闯关微信小游戏。玩家以上帝视角操控角色在场景中移动，触发各类诈骗事件，通过判断风险等级学习反诈知识。

**核心特色:**
- 🎮 沉浸式诈骗场景还原，打破第四面墙
- 📚 6 大诈骗类型全覆盖，30+ 真实风险事件
- 🎯 5 阶角色成长体系，从校园新人到社会守护者
- 💰 完整的金币经济闭环，模拟真实生活成本
- 🤝 微信社交裂变，分享助力学反诈
- 🎨 简笔画 + 墨水瓶手绘风格，青春简约

---

## 🎯 核心玩法

### 游戏流程
1. **选择关卡** - 根据角色等级解锁不同场景
2. **移动触发** - 操控角色在场景中移动，触发随机事件
3. **风险判断** - 对每个事件选择【安全】【低风险】【高风险】
4. **奖惩反馈** - 判断正确获得金币，错误扣除金币
5. **通关解锁** - 剩余金币≥0 通关，解锁新内容

### 角色成长体系
| 等级 | 身份 | 解锁场景 | 进阶条件 |
|------|------|----------|----------|
| Lv1 | 校园新人 | 校园、社交 | 通关 1-2 关 + 成功 10 次 |
| Lv2 | 兼职探索者 | 兼职、二手 | 通关 3-4 关 + 成功 25 次 |
| Lv3 | 生活达人 | 租房、维权 | 通关 5-6 关 + 成功 40 次 |
| Lv4 | 职场预备役 | 职场、金融 | 通关 7-8 关 + 成功 60 次 |
| Lv5 | 社会守护者 | 法律、高端 | 通关 9-10 关 + 成功 80 次 |

### 6 大诈骗类型
1. 冒充公检法机构诈骗
2. 虚假购物/投资诈骗
3. 交友恋爱/杀猪盘诈骗
4. 中奖退税欺诈
5. 仿冒网站/APP 诈骗
6. 亲情牌/冒充亲友诈骗

---

## 🛠️ 技术栈

### 前端
- **框架**: 微信小游戏原生框架 + Phaser.js v3
- **语言**: JavaScript (ES6+)
- **适配**: 微信小游戏基础库 2.2.3+
- **分辨率**: 750px × 1334px (16:9)

### 后端
- **框架**: Node.js + Express
- **数据库**: MySQL 8.0
- **进程管理**: PM2
- **部署**: Nginx 反向代理 + HTTPS

---

## 📁 项目结构

```
huolegeyou/
├── frontend/              # 微信小游戏前端
│   ├── game.js           # 游戏主入口
│   ├── game.json         # 游戏配置
│   ├── project.config.json
│   ├── scenes/           # 游戏场景
│   │   ├── BootScene.js
│   │   ├── StartScene.js
│   │   ├── LevelSelectScene.js
│   │   ├── GameScene.js
│   │   ├── ResultScene.js
│   │   ├── ShopScene.js
│   │   └── HelpScene.js
│   └── assets/           # 资源文件
│       ├── images/
│       ├── audio/
│       └── fonts/
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── app.js        # 应用入口
│   │   ├── config/       # 配置文件
│   │   └── routes/       # API 路由
│   ├── package.json
│   └── .env.example
├── database/             # 数据库脚本
│   ├── init.sql          # 表结构初始化
│   └── seed_events.sql   # 初始数据导入
├── docs/                 # 文档
│   ├── DEPLOYMENT.md     # 部署文档
│   ├── API.md            # 接口文档
│   └── OPERATIONS.md     # 运营文档
└── README.md
```

---

## 🚀 快速开始

### 1. 后端部署

```bash
# 安装依赖
cd backend
npm install

# 配置环境变量
cp .env.example .env
vim .env  # 修改数据库配置等

# 初始化数据库
mysql -u root -p < ../database/init.sql
mysql -u root -p < ../database/seed_events.sql

# 启动服务
pm2 start src/app.js --name huolegeyou-api
```

### 2. 前端配置

1. 打开微信开发者工具
2. 导入 `frontend` 目录
3. 配置正确的 AppID
4. 修改 `game.js` 中的 `API_BASE` 为实际域名
5. 编译运行

### 3. 测试验证

访问 `https://www.yiouxiaozhan.top/api/health` 确认后端正常。

---

## 📊 数据字典

### userInfo 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| openid | VARCHAR(64) | 微信用户 ID |
| gold_coins | INT | 金币数量 |
| role_level | INT | 角色等级 1-5 |
| total_success_count | INT | 累计成功次数 |
| unlocked_scenes | TEXT | 已解锁场景 JSON |

### riskEvents 风险事件表
| 字段 | 类型 | 说明 |
|------|------|------|
| event_id | VARCHAR(32) | 事件 ID |
| fraud_type | VARCHAR(32) | 诈骗类型 |
| risk_level | INT | 风险等级 1-3 |
| scene_type | VARCHAR(32) | 场景类型 |
| cost_invest | INT | 投入成本 |
| success_reward | INT | 成功奖励 |

---

## 📝 运营文档

### 新增风险事件

1. 按照 `database/seed_events.sql` 中的模板编写 SQL
2. 执行 `INSERT INTO riskEvents ...`
3. 关联反诈科普内容到 `antiFraudKnow` 表
4. 无需修改代码，新事件自动生效

### 内容更新规范

- **事件标题**: 简洁明了，15 字以内
- **事件内容**: 100-200 字，还原真实场景
- **科普文案**: 100-150 字，知识点清晰
- **验证题目**: 单选题，4 个选项

### 数据分析

通过以下 SQL 分析运营数据:

```sql
-- 日活跃用户
SELECT DATE(created_at) as date, COUNT(DISTINCT openid) as dau 
FROM gameRecords 
GROUP BY DATE(created_at) 
ORDER BY date DESC LIMIT 30;

-- 事件成功率
SELECT e.fraud_type, COUNT(*) as total, 
       SUM(CASE WHEN g.result = 1 THEN 1 ELSE 0 END) as success,
       ROUND(SUM(CASE WHEN g.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as rate
FROM gameRecords g
JOIN riskEvents e ON g.scene_type = e.scene_type
GROUP BY e.fraud_type;
```

---

## ⚖️ 版权说明

- **字体**: 站酷快乐体 (免费商用)
- **风格**: 简笔画 + 墨水瓶手绘 (原创)
- **代码**: MIT License
- **内容**: 反诈科普内容基于公开资料整理

---

## 📞 技术支持

- **服务器**: 8.140.253.161
- **域名**: www.yiouxiaozhan.top
- **邮箱**: support@yiouxiaozhan.top

---

**让反诈知识学习变得更有趣！🎮**
