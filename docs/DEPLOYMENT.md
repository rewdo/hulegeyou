# 《忽了个悠》部署文档

## 一、服务器环境要求

- **操作系统**: Linux (Ubuntu 20.04+ 或 CentOS 7+)
- **Node.js**: v16.0.0+
- **MySQL**: 8.0+
- **PM2**: 最新稳定版
- **域名**: www.yiouxiaozhan.top (已备案)
- **SSL 证书**: 已配置 HTTPS

---

## 二、后端服务部署

### 2.1 安装依赖

```bash
# 进入后端目录
cd /path/to/huolegeyou/backend

# 安装 npm 依赖
npm install --production
```

### 2.2 配置环境变量

```bash
# 复制环境配置模板
cp .env.example .env

# 编辑 .env 文件
vim .env
```

**.env 配置说明:**

```env
# 服务器配置
SERVER_PORT=3000
SERVER_HOST=0.0.0.0

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的 MySQL 密码
DB_NAME=huolegeyou

# 微信配置
WECHAT_APP_ID=你的小程序 AppID
WECHAT_APP_SECRET=你的小程序 AppSecret

# 广告配置
AD_UNIT_ID=你的广告单元 ID

# 域名配置
ALLOWED_DOMAINS=www.yiouxiaozhan.top

# 环境
NODE_ENV=production
```

### 2.3 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source /path/to/huolegeyou/database/init.sql

# 执行初始数据导入
source /path/to/huolegeyou/database/seed_events.sql

# 退出
exit
```

### 2.4 使用 PM2 启动服务

```bash
# 安装 PM2 (如未安装)
npm install -g pm2

# 启动服务
pm2 start src/app.js --name huolegeyou-api

# 设置开机自启
pm2 startup
pm2 save

# 查看服务状态
pm2 status

# 查看日志
pm2 logs huolegeyou-api
```

### 2.5 配置 Nginx 反向代理

```nginx
# /etc/nginx/conf.d/huolegeyou.conf
server {
    listen 80;
    server_name www.yiouxiaozhan.top;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.yiouxiaozhan.top;
    
    # SSL 证书配置
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 前端静态文件
    location / {
        root /path/to/huolegeyou/frontend;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 三、微信小游戏配置

### 3.1 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `frontend` 目录
4. 填写正确的 AppID
5. 点击"导入"

### 3.2 配置域名白名单

在微信公众平台设置 → 开发设置 → 服务器域名：

- **request 合法域名**: `https://www.yiouxiaozhan.top`
- **uploadFile 合法域名**: `https://www.yiouxiaozhan.top`
- **downloadFile 合法域名**: `https://www.yiouxiaozhan.top`

### 3.3 配置广告组件

1. 登录微信公众平台
2. 功能 → 流量主 → 开通流量主
3. 创建广告位（激励视频广告）
4. 获取广告单元 ID
5. 更新后端 `.env` 中的 `AD_UNIT_ID`
6. 更新前端 `ShopScene.js` 中的广告 ID

### 3.4 提交审核

1. 版本管理 → 上传版本
2. 填写版本信息
3. 提交审核
4. 等待审核通过

---

## 四、常见问题排查

### 4.1 后端服务无法启动

```bash
# 检查端口占用
netstat -tlnp | grep 3000

# 检查 Node.js 版本
node -v

# 检查依赖安装
npm list

# 查看 PM2 日志
pm2 logs huolegeyou-api --lines 100
```

### 4.2 数据库连接失败

```bash
# 检查 MySQL 服务
systemctl status mysql

# 测试数据库连接
mysql -u root -p -e "SELECT 1"

# 检查数据库权限
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost'"
```

### 4.3 跨域问题

确保 Nginx 配置中包含正确的 CORS 头，或检查后端 `app.js` 中的 CORS 配置。

### 4.4 微信小游戏网络请求失败

1. 确认域名已配置 HTTPS
2. 确认域名已在微信公众平台添加为合法域名
3. 检查开发者工具中是否勾选"不校验合法域名"

---

## 五、日常运维

### 5.1 查看服务状态

```bash
pm2 status
pm2 monit
```

### 5.2 重启服务

```bash
pm2 restart huolegeyou-api
```

### 5.3 更新代码

```bash
# 拉取最新代码
git pull

# 安装新依赖
npm install

# 重启服务
pm2 restart huolegeyou-api
```

### 5.4 数据库备份

```bash
# 备份数据库
mysqldump -u root -p huolegeyou > backup_$(date +%Y%m%d).sql

# 定时备份（添加到 crontab）
0 2 * * * mysqldump -u root -pYOURPASSWORD huolegeyou > /backup/huolegeyou_$(date +\%Y\%m\%d).sql
```

---

## 六、性能优化建议

1. **启用 Redis 缓存**: 缓存用户信息、事件数据
2. **CDN 加速**: 静态资源使用 CDN
3. **数据库优化**: 添加索引，优化查询
4. **日志轮转**: 配置 PM2 日志轮转，避免日志过大

---

**部署完成后，访问 https://www.yiouxiaozhan.top/api/health 确认服务正常运行。**
