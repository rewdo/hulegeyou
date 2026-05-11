-- 《忽了个悠》数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS huolegeyou DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huolegeyou;

-- ============================================
-- 1. 用户信息表 userInfo
-- ============================================
CREATE TABLE IF NOT EXISTS userInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL UNIQUE COMMENT '微信用户 openid',
    nickname VARCHAR(64) DEFAULT '悠客' COMMENT '用户昵称',
    avatar_url VARCHAR(255) DEFAULT '' COMMENT '头像 URL',
    gold_coins INT DEFAULT 2000 COMMENT '金币数量',
    role_level INT DEFAULT 1 COMMENT '角色等级 1-5',
    role_identity VARCHAR(32) DEFAULT '校园新人' COMMENT '角色身份',
    total_success_count INT DEFAULT 0 COMMENT '累计识别成功次数',
    total_fail_count INT DEFAULT 0 COMMENT '累计识别失败次数',
    unlocked_scenes TEXT COMMENT '已解锁场景 JSON 数组',
    props TEXT COMMENT '道具库存 JSON 数组',
    decorations TEXT COMMENT '装饰解锁 JSON 数组',
    last_login_time DATETIME DEFAULT NULL COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_openid (openid),
    INDEX idx_level (role_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- ============================================
-- 2. 风险事件表 riskEvents
-- ============================================
CREATE TABLE IF NOT EXISTS riskEvents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(32) NOT NULL UNIQUE COMMENT '风险事件 ID',
    event_type VARCHAR(32) NOT NULL COMMENT '事件类型：按键/弹窗/交互事件/文档表单/社交聊天/场景界面',
    fraud_type VARCHAR(32) NOT NULL COMMENT '诈骗类型：冒充公检法/虚假购物投资/交友杀猪盘/中奖退税/仿冒网站 APP/亲情牌冒充亲友',
    briskly_point VARCHAR(32) NOT NULL COMMENT 'BRISKLY 风险点',
    risk_level INT NOT NULL COMMENT '风险等级 1=安全 2=低风险 3=高风险',
    scene_type VARCHAR(32) NOT NULL COMMENT '场景类型：校园/社交福利/兼职/二手交易/租房/消费维权/职场入职/基础金融/法律合同/高端诈骗',
    min_role_level INT DEFAULT 1 COMMENT '最低角色等级要求',
    title VARCHAR(128) NOT NULL COMMENT '事件标题',
    content TEXT NOT NULL COMMENT '事件核心内容',
    style_config TEXT COMMENT '样式配置 JSON',
    button_config TEXT COMMENT '按钮配置 JSON',
    cost_invest INT DEFAULT 0 COMMENT '投入成本金币',
    success_reward INT DEFAULT 50 COMMENT '成功奖励金币',
    fail_penalty INT DEFAULT 30 COMMENT '失败惩罚金币',
    fail_penalty_rate DECIMAL(3,2) DEFAULT 0.5 COMMENT '失败额外惩罚比例',
    anti_fraud_id INT NOT NULL COMMENT '关联反诈科普 ID',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用 1=启用 0=禁用',
    sort_order INT DEFAULT 0 COMMENT '排序权重',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_fraud_type (fraud_type),
    INDEX idx_scene_type (scene_type),
    INDEX idx_risk_level (risk_level),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='风险事件表';

-- ============================================
-- 3. 反诈科普表 antiFraudKnow
-- ============================================
CREATE TABLE IF NOT EXISTS antiFraudKnow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    know_id INT NOT NULL UNIQUE COMMENT '科普 ID',
    title VARCHAR(128) NOT NULL COMMENT '科普标题',
    content TEXT NOT NULL COMMENT '科普内容 100-150 字',
    verify_question TEXT NOT NULL COMMENT '验证题目 JSON',
    related_event_ids TEXT COMMENT '关联风险事件 ID 列表 JSON',
    view_count INT DEFAULT 0 COMMENT '阅读次数',
    help_count INT DEFAULT 0 COMMENT '助力次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_know_id (know_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='反诈科普表';

-- ============================================
-- 4. 游戏记录表 gameRecords
-- ============================================
CREATE TABLE IF NOT EXISTS gameRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL COMMENT '用户 openid',
    scene_type VARCHAR(32) NOT NULL COMMENT '场景类型',
    level INT NOT NULL COMMENT '关卡数',
    events_total INT NOT NULL COMMENT '总事件数',
    events_success INT NOT NULL COMMENT '成功事件数',
    gold_change INT NOT NULL COMMENT '金币变化',
    result TINYINT NOT NULL COMMENT '结果 1=通关 0=失败',
    duration INT DEFAULT 0 COMMENT '耗时秒数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_openid (openid),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游戏记录表';

-- ============================================
-- 5. 分享助力记录表 shareHelpRecords
-- ============================================
CREATE TABLE IF NOT EXISTS shareHelpRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    share_openid VARCHAR(64) NOT NULL COMMENT '分享者 openid',
    help_openid VARCHAR(64) NOT NULL COMMENT '助力者 openid',
    help_type TINYINT NOT NULL COMMENT '助力类型 1=补助金 2=豁免惩罚',
    gold_reward INT DEFAULT 200 COMMENT '奖励金币',
    is_completed TINYINT DEFAULT 0 COMMENT '是否完成 1=完成 0=未完成',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_share (share_openid),
    INDEX idx_help (help_openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分享助力记录表';

-- ============================================
-- 6. 每日登录记录表 dailyLoginRecords
-- ============================================
CREATE TABLE IF NOT EXISTS dailyLoginRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL COMMENT '用户 openid',
    login_date DATE NOT NULL COMMENT '登录日期',
    gold_deducted INT NOT NULL COMMENT '扣除金币数',
    is_half_rate TINYINT DEFAULT 0 COMMENT '是否减半 1=是 0=否',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_openid_date (openid, login_date),
    INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日登录记录表';

-- ============================================
-- 7. 广告观看记录表 adWatchRecords
-- ============================================
CREATE TABLE IF NOT EXISTS adWatchRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL COMMENT '用户 openid',
    watch_date DATE NOT NULL COMMENT '观看日期',
    watch_count INT DEFAULT 1 COMMENT '观看次数',
    gold_rewarded INT NOT NULL COMMENT '奖励金币数',
    last_watch_time DATETIME DEFAULT NULL COMMENT '最后观看时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_openid_date (openid, watch_date),
    INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广告观看记录表';
