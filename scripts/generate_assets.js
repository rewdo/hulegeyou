/**
 * 忽了个悠 美术资源生成脚本
 * 生成简笔画风格 SVG 资源文件
 * 输出到 assets/images/
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'images');

const assets = {};

// ============ 1. 启动页背景 750×1334 ============
assets.bg_start = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1334" width="750" height="1334">
  <rect width="750" height="1334" fill="#F5F2E9"/>
  <!-- 墨水瓶装饰 -->
  <g stroke="#333333" stroke-width="2" fill="none" opacity="0.08">
    <ellipse cx="150" cy="350" rx="60" ry="40"/>
    <path d="M150,350 L150,250 Q150,230 140,220"/>
    <path d="M150,350 L150,250 Q150,230 160,220"/>
    <ellipse cx="680" cy="1000" rx="80" ry="50"/>
    <path d="M680,1000 L680,880 Q680,850 665,840"/>
    <path d="M680,1000 L680,880 Q680,850 695,840"/>
  </g>
  <!-- 简笔画装饰线 -->
  <g stroke="#333333" stroke-width="1.5" opacity="0.06">
    <path d="M50,200 Q200,150 350,220 Q500,290 700,200"/>
    <path d="M30,1100 Q200,1050 400,1120 Q550,1190 720,1100"/>
    <path d="M0,700 Q100,650 200,720 Q300,790 400,700"/>
    <path d="M350,1300 Q500,1250 750,1320"/>
  </g>
  <!-- 小墨点装饰 -->
  <g fill="#333333" opacity="0.05">
    <circle cx="80" cy="180" r="8"/>
    <circle cx="620" cy="260" r="12"/>
    <circle cx="100" cy="900" r="6"/>
    <circle cx="700" cy="500" r="10"/>
    <circle cx="200" cy="1200" r="9"/>
    <circle cx="550" cy="1150" r="7"/>
  </g>
  <!-- 星星点缀 -->
  <g fill="#333333" opacity="0.06">
    <polygon points="50,150 55,165 70,165 58,175 62,190 50,180 38,190 42,175 30,165 45,165"/>
    <polygon points="680,300 683,310 695,310 686,318 689,328 680,320 671,328 674,318 665,310 677,310"/>
    <polygon points="120,750 123,760 135,760 126,768 129,778 120,770 111,778 114,768 105,760 117,760"/>
  </g>
</svg>`;

// ============ 2. 默认角色形象 200×200 ============
assets.character_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <!-- 简笔画风格人形 -->
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 头 -->
    <circle cx="100" cy="55" r="35"/>
    <!-- 眼睛 -->
    <circle cx="87" cy="50" r="3" fill="#333333"/>
    <circle cx="113" cy="50" r="3" fill="#333333"/>
    <!-- 微笑 -->
    <path d="M88,65 Q100,75 112,65"/>
    <!-- 身体 -->
    <path d="M100,90 L100,150"/>
    <!-- 手臂 -->
    <path d="M100,105 L60,130"/>
    <path d="M100,105 L140,130"/>
    <!-- 腿 -->
    <path d="M100,150 L65,195"/>
    <path d="M100,150 L135,195"/>
    <!-- 头发 -->
    <path d="M65,50 Q65,20 85,18 Q100,15 115,18 Q135,20 135,50" fill="#333333" opacity="0.8"/>
  </g>
</svg>`;

// ============ 3. 开始游戏按钮 200×200 ============
assets.btn_start = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g>
    <!-- 按钮背景 -->
    <rect x="10" y="50" width="180" height="100" rx="20" ry="20" fill="#D93A3A" stroke="#AA2E2E" stroke-width="2"/>
    <!-- 播放三角形图标 -->
    <polygon points="75,75 75,125 120,100" fill="#FFFFFF"/>
    <!-- 文字 -->
    <text x="135" y="105" font-family="sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">开始</text>
  </g>
</svg>`;

// ============ 4. 帮助按钮 200×200 ============
assets.btn_help = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 圆环 -->
    <circle cx="100" cy="100" r="70"/>
    <!-- 问号 -->
    <path d="M85,70 Q100,55 115,70 Q120,80 114,90 Q100,100 100,110" stroke-width="4"/>
    <circle cx="100" cy="130" r="5" fill="#333333"/>
  </g>
</svg>`;

// ============ 5. 金币图标 200×200 ============
assets.icon_gold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g>
    <!-- 金币主体 -->
    <circle cx="100" cy="100" r="80" fill="#FFD700" stroke="#DAA520" stroke-width="3"/>
    <!-- 内圈 -->
    <circle cx="100" cy="100" r="55" fill="none" stroke="#DAA520" stroke-width="1.5"/>
    <!-- 钱币符号 ¥ -->
    <text x="100" y="115" font-family="serif" font-size="64" font-weight="bold" fill="#B8860B" text-anchor="middle" dominant-baseline="central">¥</text>
    <!-- 高光 -->
    <ellipse cx="75" cy="70" rx="25" ry="15" fill="#FFF8DC" opacity="0.4" transform="rotate(-30,75,70)"/>
  </g>
</svg>`;

// ============ 6. 等级图标 200×200 ============
assets.icon_level = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 盾牌形状 -->
    <path d="M100,15 L170,50 L170,95 Q170,140 100,185 Q30,140 30,95 L30,50 Z" fill="#FFFFFF"/>
    <!-- 内部星级标记 -->
    <polygon points="100,50 110,75 137,75 115,92 123,118 100,102 77,118 85,92 63,75 90,75" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/>
    <!-- 升级箭头 -->
    <path d="M100,140 L100,170" stroke-width="2"/>
    <path d="M85,155 L100,140 L115,155" stroke-width="2"/>
  </g>
</svg>`;

// ============ 7. 游戏场景通用背景 750×1334 ============
assets.bg_game_scene = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1334" width="750" height="1334">
  <rect width="750" height="1334" fill="#F5F2E9"/>
  <!-- 场景装饰框 -->
  <rect x="40" y="100" width="670" height="1100" rx="10" ry="10" fill="none" stroke="#333333" stroke-width="2" opacity="0.15"/>
  <!-- 顶部装饰线 -->
  <g stroke="#333333" stroke-width="1.5" opacity="0.08">
    <path d="M40,95 L710,95"/>
    <path d="M40,1200 L710,1200"/>
  </g>
  <!-- 网格装饰 -->
  <g stroke="#333333" stroke-width="0.5" opacity="0.04">
    <path d="M370,100 L370,1200"/>
    <path d="M40,650 L710,650"/>
  </g>
  <!-- 角落装饰 - 简笔画小植物 -->
  <g fill="none" stroke="#333333" stroke-width="1.5" opacity="0.1">
    <path d="M60,1130 Q70,1100 100,1090"/>
    <path d="M60,1130 Q80,1110 110,1120"/>
    <path d="M690,130 Q700,160 730,170"/>
    <path d="M690,130 Q710,150 740,140"/>
  </g>
  <!-- 中央场地指示 -->
  <text x="375" y="660" font-family="sans-serif" font-size="32" fill="#333333" opacity="0.08" text-anchor="middle" dominant-baseline="central">探索区域</text>
</svg>`;

// ============ 8. 漏洞探测器 200×200 ============
assets.btn_detector = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 放大镜 -->
    <circle cx="82" cy="82" r="50"/>
    <!-- 放大镜手柄 -->
    <line x1="118" y1="118" x2="165" y2="165" stroke-width="6"/>
    <!-- 镜片内 Z 形折线（表示漏洞/探测） -->
    <polyline points="65,70 85,55 75,85 95,70" stroke="#D93A3A" stroke-width="2.5"/>
    <!-- 镜片高光 -->
    <path d="M65,60 Q75,50 85,55" stroke-width="1.5" opacity="0.3"/>
  </g>
</svg>`;

// ============ 9. 止损卡 200×200 ============
assets.btn_stopLoss = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 盾牌 -->
    <path d="M100,15 L175,55 L175,105 Q175,150 100,190 Q25,150 25,105 L25,55 Z" fill="#FFFFFF"/>
    <!-- 盾牌内对勾 -->
    <path d="M65,100 L90,125 L140,75" stroke="#4CAF50" stroke-width="5" stroke-linecap="round"/>
    <!-- 盾牌边框装饰线 -->
    <path d="M50,65 L100,80 L150,65" stroke-width="1.5" opacity="0.3"/>
  </g>
</svg>`;

// ============ 10. 撤销卡 200×200 ============
assets.btn_revert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 矩形卡牌 -->
    <rect x="25" y="40" width="150" height="130" rx="12" ry="12"/>
    <!-- 撤销箭头 -->
    <path d="M130,90 Q130,65 100,65 Q70,65 55,90"/>
    <path d="M55,90 L75,75" stroke-width="3.5"/>
    <path d="M55,90 L70,108" stroke-width="3.5"/>
    <!-- 箭头 -->
    <path d="M130,130 L145,130 L145,90" stroke-width="2"/>
    <path d="M130,130 L120,120" stroke-width="2"/>
  </g>
</svg>`;

// ============ 11. 成功图标 200×200 ============
assets.icon_success = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- 绿色圆环 -->
    <circle cx="100" cy="100" r="85" fill="#E8F5E9" stroke="#4CAF50" stroke-width="4"/>
    <!-- 对勾 -->
    <path d="M55,100 L82,130 L145,65" stroke="#4CAF50" stroke-width="8"/>
    <!-- 高光 -->
    <circle cx="60" cy="60" r="20" fill="#FFFFFF" opacity="0.3"/>
  </g>
</svg>`;

// ============ 12. 失败图标 200×200 ============
assets.icon_fail = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- 红色圆环 -->
    <circle cx="100" cy="100" r="85" fill="#FFEBEE" stroke="#F44336" stroke-width="4"/>
    <!-- 叉号 -->
    <line x1="60" y1="60" x2="140" y2="140" stroke="#F44336" stroke-width="8"/>
    <line x1="140" y1="60" x2="60" y2="140" stroke="#F44336" stroke-width="8"/>
  </g>
</svg>`;

// ============ 13. 通关结果背景 750×1334 ============
assets.bg_result_pass = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1334" width="750" height="1334">
  <rect width="750" height="1334" fill="#E8F5E9"/>
  <!-- 庆祝装饰 - 星星 -->
  <g fill="#FFD700" opacity="0.15">
    <polygon points="100,200 106,218 125,218 110,230 115,248 100,236 85,248 90,230 75,218 94,218"/>
    <polygon points="650,300 656,318 675,318 660,330 665,348 650,336 635,348 640,330 625,318 644,318"/>
    <polygon points="150,900 156,918 175,918 160,930 165,948 150,936 135,948 140,930 125,918 144,918"/>
    <polygon points="600,1000 606,1018 625,1018 610,1030 615,1048 600,1036 585,1048 590,1030 575,1018 594,1018"/>
  </g>
  <!-- 飘带装饰 -->
  <g stroke="#4CAF50" stroke-width="2" fill="none" opacity="0.1">
    <path d="M0,200 Q100,180 200,220 Q300,260 400,200 Q500,140 600,220 Q700,300 750,200"/>
    <path d="M0,1000 Q150,950 300,1050 Q450,1150 600,1000 Q700,900 750,1050"/>
  </g>
  <!-- 底部光晕 -->
  <circle cx="375" cy="1050" r="300" fill="#C8E6C9" opacity="0.15"/>
</svg>`;

// ============ 14. 失败结果背景 750×1334 ============
assets.bg_result_fail = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1334" width="750" height="1334">
  <rect width="750" height="1334" fill="#FFEBEE"/>
  <!-- 温柔装饰 -->
  <g stroke="#F44336" stroke-width="1.5" fill="none" opacity="0.08">
    <path d="M0,300 Q200,250 400,350 Q600,450 750,300"/>
    <path d="M0,900 Q200,850 400,950 Q600,1050 750,900"/>
  </g>
  <!-- 小点装饰 -->
  <g fill="#F44336" opacity="0.08">
    <circle cx="120" cy="400" r="6"/>
    <circle cx="630" cy="500" r="8"/>
    <circle cx="80" cy="800" r="5"/>
    <circle cx="670" cy="700" r="7"/>
  </g>
  <!-- 底部渐变 -->
  <circle cx="375" cy="1050" r="250" fill="#FFCDD2" opacity="0.12"/>
</svg>`;

// ============ 15. 游戏标题 Logo 200×200 ============
assets.logo_title = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- 墨水瓶轮廓 -->
    <ellipse cx="100" cy="145" rx="45" ry="12"/>
    <path d="M55,145 L55,100 Q55,88 70,82 L100,70 L130,82 Q145,88 145,100 L145,145"/>
    <!-- 瓶口 -->
    <path d="M80,82 L80,50 Q80,40 100,40 Q120,40 120,50 L120,82"/>
    <!-- 墨水 -->
    <path d="M65,120 Q80,110 100,120 Q120,130 135,120" stroke="#333333" stroke-width="1.5" opacity="0.3"/>
    <!-- 从瓶口飘出的文字气泡 -->
    <path d="M100,30 Q100,10 120,8 Q140,6 140,20 Q140,34 120,36 Q110,37 105,40" fill="#FFFFFF"/>
    <!-- 气泡内的"悠"字 -->
    <text x="124" y="28" font-family="serif" font-size="20" fill="#D93A3A" font-weight="bold" text-anchor="middle" dominant-baseline="central">悠</text>
    <!-- 装饰小点 -->
    <circle cx="50" cy="55" r="3" fill="#D93A3A" opacity="0.5"/>
    <circle cx="35" cy="80" r="2" fill="#D93A3A" opacity="0.3"/>
    <circle cx="155" cy="55" r="3" fill="#D93A3A" opacity="0.5"/>
    <circle cx="165" cy="80" r="2" fill="#D93A3A" opacity="0.3"/>
  </g>
</svg>`;

// ============ Additional: bg_top_bar.svg — 顶部信息栏背景 ============
assets.bg_top_bar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 100" width="750" height="100">
  <rect width="750" height="100" fill="#333333" opacity="0.95"/>
  <line x1="0" y1="100" x2="750" y2="100" stroke="#555555" stroke-width="1"/>
</svg>`;

// ============ Additional: bg_prop_bar.svg — 底部道具栏背景 ============
assets.bg_prop_bar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 100" width="750" height="100">
  <rect width="750" height="100" fill="#333333" opacity="0.9"/>
  <line x1="0" y1="0" x2="750" y2="0" stroke="#555555" stroke-width="1"/>
</svg>`;

// ============ Additional: btn_pause.svg — 暂停按钮 ============
assets.btn_pause = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <g fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
    <rect x="15" y="15" width="10" height="30" rx="2"/>
    <rect x="35" y="15" width="10" height="30" rx="2"/>
  </g>
</svg>`;

// ============ Additional: bg_dialog.svg — 弹窗背景 ============
assets.bg_dialog = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <rect x="0" y="0" width="600" height="700" rx="15" ry="15" fill="#FFFFFF" stroke="#333333" stroke-width="3"/>
</svg>`;

// ============ Additional: npc_professor.svg — NPC 教授形象 ============
assets.npc_professor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- 头 -->
    <circle cx="100" cy="55" r="30"/>
    <!-- 眼镜 -->
    <circle cx="88" cy="52" r="10"/>
    <circle cx="112" cy="52" r="10"/>
    <line x1="98" y1="52" x2="102" y2="52" stroke-width="1.5"/>
    <!-- 眼睛小点 -->
    <circle cx="88" cy="52" r="2.5" fill="#333333"/>
    <circle cx="112" cy="52" r="2.5" fill="#333333"/>
    <!-- 微笑 -->
    <path d="M90,65 Q100,73 110,65"/>
    <!-- 身体 -->
    <path d="M100,85 L100,135"/>
    <!-- 手臂 -->
    <path d="M100,95 L60,115" stroke-width="4"/>
    <path d="M100,95 L140,115" stroke-width="4"/>
    <!-- 腿 -->
    <path d="M100,135 L70,175"/>
    <path d="M100,135 L130,175"/>
    <!-- 书本在左手 -->
    <rect x="30" y="100" width="25" height="30" rx="2" fill="#FFFFFF" stroke-width="2"/>
    <line x1="35" y1="108" x2="50" y2="108" stroke-width="1.5"/>
    <line x1="35" y1="115" x2="50" y2="115" stroke-width="1.5"/>
    <line x1="35" y1="122" x2="45" y2="122" stroke-width="1.5"/>
  </g>
</svg>`;

// ============ Additional: icon_coin.svg — 小金币 ============
assets.icon_coin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <circle cx="20" cy="20" r="18" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/>
  <text x="20" y="25" font-family="sans-serif" font-size="18" font-weight="bold" fill="#B8860B" text-anchor="middle" dominant-baseline="central">金</text>
</svg>`;

// Write all assets
function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  Object.entries(assets).forEach(([name, svgContent]) => {
    const filePath = path.join(OUTPUT_DIR, `${name}.svg`);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    console.log(`  ✓ ${name}.svg`);
  });
  
  console.log(`\n✅ 共生成 ${Object.keys(assets).length} 个 SVG 文件到 ${OUTPUT_DIR}`);
}

generateAll();
