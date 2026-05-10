# 资源文件说明

本目录存放游戏所需的图片、音效、字体等资源文件。

## 资源清单

### 图片资源 (assets/images/)

| 文件名 | 尺寸 | 说明 | 来源 |
|--------|------|------|------|
| bg_start.png | 750×1334 | 启动页背景 (浅米色墨痕) | 免费商用 |
| character_default.png | 120×120 | 默认角色形象 (简笔画) | 原创 |
| btn_start.png | 300×80 | 开始游戏按钮 | 原创 |
| btn_help.png | 200×60 | 帮助按钮 | 原创 |
| icon_gold.png | 48×48 | 金币图标 | 免费商用 |
| icon_level.png | 48×48 | 等级图标 | 免费商用 |
| scene_campus.png | 750×1334 | 校园场景背景 | 原创 |
| scene_social.png | 750×1334 | 社交场景背景 | 原创 |
| scene_job.png | 750×1334 | 兼职场景背景 | 原创 |
| ... | ... | 其他场景背景 | 原创 |

**风格要求:**
- 简笔画 + 墨水瓶手绘风格
- 主色调：深墨色 #333333、浅米色 #F5F2E9、点缀色朱砂红 #D93A3A
- 线条：粗犷手绘铅笔线

### 音效资源 (assets/audio/)

| 文件名 | 时长 | 说明 | 来源 |
|--------|------|------|------|
| bgm_main.mp3 | 2:00 | 主背景音乐 (轻松愉快) | 免费商用 |
| sfx_click.mp3 | 0:10 | 点击音效 | 免费商用 |
| sfx_success.mp3 | 0:05 | 成功音效 | 免费商用 |
| sfx_fail.mp3 | 0:05 | 失败音效 | 免费商用 |
| sfx_coin.mp3 | 0:03 | 金币获取音效 | 免费商用 |

### 字体资源 (assets/fonts/)

| 文件名 | 说明 | 授权 |
|--------|------|------|
| ZCKuaileTi.ttf | 站酷快乐体 | 免费商用 |

**字体下载:**
- 站酷快乐体：https://www.zcool.com.cn/special/zcoolfonts/

---

## 资源制作指南

### 图片制作

使用工具：
- Procreate (iPad)
- Photoshop
- Illustrator

制作步骤：
1. 创建 750×1334 画布
2. 浅米色 (#F5F2E9) 填充背景
3. 添加墨痕装饰 (深墨色 #333333, 透明度 10-20%)
4. 绘制简笔画元素 (黑色线条，粗细 3-5px)
5. 导出 PNG (压缩优化)

### 音效制作

使用工具：
- Audacity (免费)
- GarageBand
- FL Studio

要求：
- 格式：MP3, 128kbps
- 时长：不超过 2 分钟
- 风格：轻松愉快，符合反诈科普主题

---

## 免费资源推荐

### 图片
- Unsplash: https://unsplash.com (CC0)
- Pixabay: https://pixabay.com (免费)
- Pexels: https://pexels.com (免费)

### 音效
- Freesound: https://freesound.org (CC0)
- 耳聆网：https://www.sound35.com (免费)

### 字体
- 站酷字库：https://www.zcool.com.cn/special/zcoolfonts/
- 思源字库：https://source.typekit.com/

---

## 资源优化

### 图片压缩
```bash
# 使用 tinypng 压缩
npm install -g tinypng
tinypng assets/images/*.png
```

### 音频压缩
```bash
# 使用 ffmpeg 压缩
ffmpeg -i input.mp3 -ab 128k output.mp3
```

### 体积要求
- 首包体积：< 4MB (微信小游戏限制)
- 单张图片：< 200KB
- 单个音效：< 100KB

---

**注意：所有资源必须确保免费商用授权，避免版权纠纷！**
