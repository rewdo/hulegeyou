#!/bin/bash

# 《忽了个悠》一键部署脚本
# 使用：bash deploy.sh

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           《忽了个悠》反诈小游戏一键部署脚本                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${YELLOW}[1/6] 检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误：未检测到 Node.js，请先安装 Node.js v16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js 版本：$(node -v)${NC}"

# 检查 MySQL
echo -e "${YELLOW}[2/6] 检查 MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}错误：未检测到 MySQL，请先安装 MySQL 8.0+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL 已安装${NC}"

# 安装后端依赖
echo -e "${YELLOW}[3/6] 安装后端依赖...${NC}"
cd backend
npm install --production
echo -e "${GREEN}✓ 后端依赖安装完成${NC}"
cd ..

# 配置环境变量
echo -e "${YELLOW}[4/6] 配置环境变量...${NC}"
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}请编辑 backend/.env 文件，配置数据库连接等信息${NC}"
    echo "按回车继续..."
    read
fi
echo -e "${GREEN}✓ 环境变量配置完成${NC}"

# 初始化数据库
echo -e "${YELLOW}[5/6] 初始化数据库...${NC}"
read -p "请输入 MySQL root 密码：" -s MYSQL_PASSWORD
echo

mysql -u root -p"$MYSQL_PASSWORD" < database/init.sql
mysql -u root -p"$MYSQL_PASSWORD" < database/seed_events.sql
echo -e "${GREEN}✓ 数据库初始化完成${NC}"

# 启动服务
echo -e "${YELLOW}[6/6] 启动服务...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}安装 PM2...${NC}"
    npm install -g pm2
fi

cd backend
pm2 start ecosystem.config.js --env production
pm2 save
cd ..

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║              🎉 部署完成！                                  ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║   后端服务：http://localhost:3000                          ║${NC}"
echo -e "${GREEN}║   健康检查：http://localhost:3000/api/health               ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║   查看日志：pm2 logs huolegeyou-api                        ║${NC}"
echo -e "${GREEN}║   停止服务：pm2 stop huolegeyou-api                        ║${NC}"
echo -e "${GREEN}║   重启服务：pm2 restart huolegeyou-api                     ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "1. 配置 Nginx 反向代理 (参考 docs/DEPLOYMENT.md)"
echo "2. 配置 SSL 证书 (HTTPS)"
echo "3. 微信开发者工具导入 frontend 目录"
echo "4. 配置小程序 AppID 和域名白名单"
echo ""
