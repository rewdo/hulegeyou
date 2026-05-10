/**
 * 《忽了个悠》后端服务主入口
 * Node.js + Express + MySQL
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');

// 导入路由
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const eventRoutes = require('./routes/event');
const shareRoutes = require('./routes/share');
const adRoutes = require('./routes/ad');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// ============================================
// 安全中间件
// ============================================

// Helmet 安全头
app.use(helmet({
  contentSecurityPolicy: false, // 开发环境可关闭
  crossOriginEmbedderPolicy: false
}));

// CORS 配置
app.use(cors({
  origin: ['https://www.yiouxiaozhan.top', 'https://liteapp.weixin.qq.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 请求限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 最多 100 次请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', limiter);

// 解析请求体
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// API 路由
// ============================================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '《忽了个悠》服务运行中', timestamp: new Date().toISOString() });
});

// 用户相关接口
app.use('/api/user', userRoutes);

// 游戏相关接口
app.use('/api/game', gameRoutes);

// 事件相关接口
app.use('/api/event', eventRoutes);

// 分享助力接口
app.use('/api/share', shareRoutes);

// 广告接口
app.use('/api/ad', adRoutes);

// ============================================
// 错误处理
// ============================================

// 404 处理
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err.stack);
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  });
});

// ============================================
// 启动服务
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           《忽了个悠》反诈小游戏后端服务                      ║
║                                                           ║
║   服务地址：http://0.0.0.0:${PORT}                          ║
║   环境：${process.env.NODE_ENV || 'development'}${'                                        '.substring(0, 20 - (process.env.NODE_ENV || 'development').length)}║
║   时间：${new Date().toLocaleString('zh-CN')}                          ║
║                                                           ║
║   接口文档：/api/health                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
