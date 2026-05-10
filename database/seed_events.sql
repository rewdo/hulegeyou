-- 《忽了个悠》风险事件初始数据
USE huolegeyou;

-- ============================================
-- 反诈科普数据 (先插入科普，事件表会关联)
-- ============================================
INSERT INTO antiFraudKnow (know_id, title, content, verify_question, related_event_ids) VALUES
(1, '冒充公检法诈骗揭秘', '公检法机关不会通过电话、QQ、微信等社交工具办案，更不会要求转账到"安全账户"。凡是自称公检法要求转账的都是诈骗！记住：真警察不会电话办案，安全账户不存在，转账要求必是诈。', '{"question":"公检法机关会通过什么方式要求你转账到安全账户？","options":["A. 电话通知","B. 微信联系","C. 从来不会","D. QQ 告知"],"answer":"C"}', '["GJF001","GJF002"]'),
(2, '兼职刷单陷阱', '所有刷单都是违法的！前期小额返利只是诱饵，后期大额投入必被骗。记住：刷单=诈骗，垫付=送钱，高回报=高风险。天上不会掉馅饼，踏实工作最靠谱。', '{"question":"关于刷单兼职，以下说法正确的是？","options":["A. 前期都能赚钱","B. 所有刷单都是诈骗","C. 大额刷单才危险","D. 熟人介绍就安全"],"answer":"B"}', '["JZ001","JZ002","JZ003"]'),
(3, '杀猪盘恋爱诈骗', '网恋需谨慎，谈钱必是诈！骗子会打造完美人设，与你建立恋爱关系后诱导投资、借钱。记住：网恋不见面、转账拉黑你、高回报平台都是假。', '{"question":"网恋对象向你推荐投资理财平台，应该？","options":["A. 立即投资","B. 先投小额试试","C. 拒绝并举报","D. 拉上朋友一起"],"answer":"C"}', '["SZP001","SZP002"]'),
(4, '虚假购物诈骗', '网购请选择正规平台！私下交易、提前付款、超低价商品都是陷阱。记住：脱离平台无保障，提前付款钱难追，低价诱惑是陷阱。', '{"question":"二手平台交易时，以下哪种行为最安全？","options":["A. 微信直接转账","B. 平台担保交易","C. 银行提前汇款","D. 现金面交最安全"],"answer":"B"}', '["GW001","GW002","GW003"]'),
(5, '中奖退税骗局', '天上不会掉馅饼！所有"中奖""退税"要求先交钱的都是诈骗。记住：中奖不用先交钱，退税不会私下办，官方渠道最安全。', '{"question":"收到中奖短信要求交手续费，应该？","options":["A. 立即交费领大奖","B. 先交小额试试","C. 直接删除不理","D. 打电话确认"],"answer":"C"}', '["ZJ001","ZJ002"]'),
(6, '仿冒网站 APP 诈骗', '钓鱼网站模仿正规平台，窃取你的账号密码和资金。记住：核对网址很重要，官方应用店下载，陌生链接不要点。', '{"question":"如何识别仿冒网站？","options":["A. 看页面是否漂亮","B. 核对网址域名","C. 看有没有客服","D. 试着重试几次"],"answer":"B"}', '["FM001","FM002"]'),
(7, '冒充亲友诈骗', '骗子冒充亲友借钱，利用你的关心实施诈骗。记住：转账之前必核实，语音视频辨真伪，紧急情况找本人。', '{"question":"收到"朋友"微信借钱，第一步应该？","options":["A. 立即转账","B. 打电话核实","C. 问清楚用途","D. 先转一半"],"answer":"B"}', '["QQ001","QQ002"]'),
(8, '校园贷陷阱', '校园贷利息高、套路深，一旦陷入难以脱身。记住：正规贷款看资质，校园贷多高利贷，量入为出莫超前。', '{"question":"关于校园贷，以下说法正确的是？","options":["A. 无抵押很方便","B. 利息低压力小","C. 多为高利贷陷阱","D. 学生都可以申请"],"answer":"C"}', '["XYD001","XYD002"]'),
(9, '网络游戏交易诈骗', '游戏账号、装备交易请选择官方平台。私下交易、代练充值、低价点券都是陷阱。记住：官方渠道最安全，私下交易风险高，代练充值多骗局。', '{"question":"购买游戏装备，最安全的做法是？","options":["A. 游戏内直接交易","B. 微信联系卖家","C. 先付款后发货","D. 找代练帮忙"],"answer":"A"}', '["YX001","YX002"]'),
(10, '征信诈骗揭秘', '骗子冒充客服称你"征信有问题"，诱导你贷款转账。记住：征信无法人为修改，客服不会让你贷款，转账操作必是诈。', '{"question":"接到电话说你征信有问题，应该？","options":["A. 按对方指导操作","B. 挂断电话核实","C. 立即转账修复","D. 提供个人信息"],"answer":"B"}', '["ZX001","ZX002"]');

-- ============================================
-- 风险事件数据 (30+ 条，覆盖 6 大诈骗类型)
-- ============================================

-- === 冒充公检法类 (GJF) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('GJF001', '社交聊天类', '冒充公检法诈骗', 'Spoofing', 3, '社交福利场景', 1, '警察来电', '【微信来电】陌生号码，接通后对方自称市公安局刑警队，说你的银行卡涉嫌洗钱案，需要配合调查。对方准确说出你的姓名和身份证号，要求你添加"警官"QQ，并下载"安全防护"APP 进行资金核查。', '{"type":"chat","avatar":"police_fake","bg":"chat_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 1),
('GJF002', '弹窗类', '冒充公检法诈骗', 'Information', 3, '校园权限场景', 1, '安全账户通知', '【系统弹窗】你收到一条"最高人民检察院"发来的消息：您的账户涉及重大案件，需立即将资金转入安全账户接受审查，审查结束后全额返还。下方有"立即转账"和"了解详情"按钮。', '{"type":"alert","style":"official_fake","icon":"seal"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 1);

-- === 兼职刷单类 (JZ) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('JZ001', '交互事件类', '虚假购物投资诈骗', 'Kickback', 3, '校园兼职场景', 1, '刷单兼职邀请', '你在兼职群看到消息："足不出户，日赚 300-500 元！只需帮商家刷销量，每单佣金 15-30 元，多劳多得！"对方让你先垫付 100 元试水，承诺立刻返还 115 元。', '{"type":"task","style":"group_msg","highlight":"日赚 300-500"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 100, 100, 100, 0.8, 2),
('JZ002', '社交聊天类', '虚假购物投资诈骗', 'Yank', 3, '校园兼职场景', 2, '大额刷单任务', '刷单客服联系你："亲，前面小额任务完成得很好！现在有个大单，垫付 3000 元，佣金 15% 即 450 元，做完这单就能提现全部收益。"并发来"成功提现"的截图。', '{"type":"chat","avatar":"kefu_fake","bg":"chat_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 3000, 150, 3000, 0.5, 2),
('JZ003', '文档表单类', '虚假购物投资诈骗', 'Information', 2, '校园兼职场景', 1, '兼职信息登记表', '某"正规兼职平台"要求你填写详细个人信息才能接单：姓名、身份证、手机号、银行卡号、支付宝账号、手持身份证照片。声称用于"实名认证和工资发放"。', '{"type":"form","style":"registration","fields":["姓名","身份证","手机号","银行卡","支付宝","手持身份证"]}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 100, 50, 0.3, 2);

-- === 杀猪盘类 (SZP) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('SZP001', '社交聊天类', '交友恋爱诈骗', 'Kickback', 3, '社交福利场景', 2, '网恋对象推荐投资', '认识两周的"完美恋人"突然说："我有个内部投资渠道，年化收益 30%，我带你一起赚钱，为了我们的未来。"发来一个看起来很高大上的投资平台链接。', '{"type":"chat","avatar":"lover_fake","bg":"romantic_bg","emotion":"关心"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 5000, 150, 5000, 0.6, 3),
('SZP002', '场景界面类', '交友恋爱诈骗', 'Spoofing', 3, '基础金融场景', 3, '虚假投资平台', '你点开"恋人"推荐的投资平台，界面精美，显示"已盈利 8888 元"，但提现时提示"需缴纳 20% 个人所得税"。客服说缴税后本金收益一起到账。', '{"type":"interface","style":"investment_fake","elements":["盈利显示","提现按钮","缴税提示"]} ', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 2000, 150, 2000, 0.7, 3);

-- === 虚假购物类 (GW) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('GW001', '弹窗类', '虚假购物诈骗', 'Low-cost', 2, '二手交易场景', 1, '超低价二手手机', '二手平台看到：iPhone 15 Pro，99 新，仅售 2000 元（市场价 8000+）。卖家说"急用钱，给钱就卖"，要求微信私下交易，不走平台担保。', '{"type":"product","style":"secondhand","price_highlight":"2000 元"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 2000, 100, 2000, 0.5, 4),
('GW002', '社交聊天类', '虚假购物诈骗', 'Information', 2, '二手交易场景', 1, '卖家要求提前确认收货', '闲鱼买东西，卖家说："我急用钱，你先确认收货，我马上发货，给你好评返 50 元。"并承诺商品没问题，走平台只是"流程需要"。', '{"type":"chat","avatar":"seller","bg":"chat_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 100, 50, 0.3, 4),
('GW003', '交互事件类', '虚假购物诈骗', 'Yank', 3, '消费维权场景', 2, '海外代购定金', '朋友圈代购："限量 LV 包包，专柜价 2 万，代购价 1.2 万！先付 3000 定金锁定，一周后到货付尾款。"发了大量"客户好评"截图。', '{"type":"task","style":"wechat_moments","highlight":"限量"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 3000, 150, 3000, 0.6, 4);

-- === 中奖退税类 (ZJ) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('ZJ001', '弹窗类', '中奖退税欺诈', 'Kickback', 3, '校园权限场景', 1, '综艺节目中奖', '【系统通知】恭喜您被《中国好声音》抽中二等奖，奖金 15 万元 + 笔记本电脑！请联系领奖热线 400-XXX-XXXX，需先缴纳 8800 元个人所得税。', '{"type":"alert","style":"lottery_fake","icon":"trophy"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 5),
('ZJ002', '社交聊天类', '中奖退税欺诈', 'Spoofing', 2, '社交福利场景', 1, '个税退税通知', '收到"税务局"短信：您有一笔 3880 元个税退税待领取，点击链接 xxx.gov.xx 填写信息。页面要求输入银行卡号、密码、验证码。', '{"type":"chat","avatar":"gov_fake","bg":"official_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 100, 50, 0.3, 5);

-- === 仿冒网站 APP 类 (FM) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('FM001', '场景界面类', '仿冒网站 APP 诈骗', 'Spoofing', 3, '基础金融场景', 2, '仿冒银行 APP', '收到短信"您的银行卡需升级"，点击链接下载"银行安全助手"APP。界面和真银行几乎一样，登录时输入了账号密码和验证码。', '{"type":"interface","style":"bank_fake","elements":["登录框","验证码输入","升级提示"]} ', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 6),
('FM002', '文档表单类', '仿冒网站 APP 诈骗', 'Information', 3, '法律合同场景', 3, '仿冒政务网站', '办理业务时搜索到"xx 市政务服务网"，网址是 xzwfw.com（官网是 xzwfw.gov.cn）。网站要求填写身份证、银行卡信息"在线办理"。', '{"type":"form","style":"gov_fake","fields":["身份证","银行卡","手机号","验证码"]}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 6);

-- === 冒充亲友类 (QQ) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('QQ001', '社交聊天类', '亲情牌诈骗', 'Spoofing', 3, '社交福利场景', 1, 'QQ 好友借钱', 'QQ 上"大学同学"突然联系："我朋友住院急用钱，微信转账限额了，能先借我 2000 吗？明天就还！"头像昵称都对，语气也很像。', '{"type":"chat","avatar":"friend_fake","bg":"chat_bg","emotion":"着急"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 7),
('QQ002', '交互事件类', '亲情牌诈骗', 'Repudiation', 3, '社交福利场景', 2, '领导微信借钱', '微信上"老板"让你帮忙转账："我在开会不方便，你先帮我转 5 万给客户，回头给你报销。"发了一个陌生账号给你。', '{"type":"task","style":"wechat_chat","highlight":"老板"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 50000, 150, 50000, 0.8, 7);

-- === 校园贷类 (XYD) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('XYD001', '弹窗类', '虚假购物投资诈骗', 'Kickback', 3, '校园权限场景', 1, '校园贷广告', '【弹窗广告】"大学生专属贷款，无抵押无担保，10 分钟到账！"点击后要求填写个人信息和联系人，号称"额度 5 万，日息仅 0.02%"。', '{"type":"alert","style":"loan_ad","icon":"money"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 100, 50, 0.3, 8),
('XYD002', '文档表单类', '虚假购物投资诈骗', 'Information', 3, '法律合同场景', 2, '贷款合同陷阱', '某贷款 APP 合同显示"月利率 1%"，但实际有"服务费""管理费""逾期费"等隐藏条款，综合年化利率超过 100%。合同要求你电子签名。', '{"type":"form","style":"contract","fields":["电子签名","人脸识别","通讯录授权"]}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 8);

-- === 网络游戏类 (YX) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('YX001', '社交聊天类', '虚假购物投资诈骗', 'Low-cost', 2, '社交福利场景', 1, '游戏装备交易', '游戏里有人私聊："我有稀有皮肤，5 折卖你！加 QQ 交易，走微信付款。"发了装备截图，价格确实便宜。', '{"type":"chat","avatar":"gamer","bg":"game_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 500, 100, 500, 0.5, 9),
('YX002', '场景界面类', '仿冒网站 APP 诈骗', 'Spoofing', 3, '社交福利场景', 2, '代充平台', '某"游戏代充网"号称"官方授权，充值 5 折"，要求提供游戏账号密码。充值后账号被盗，装备被转移。', '{"type":"interface","style":"recharge_fake","elements":["账号输入","密码输入","充值金额"]} ', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 200, 150, 200, 0.6, 9);

-- === 征信诈骗类 (ZX) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('ZX001', '社交聊天类', '冒充公检法诈骗', 'Spoofing', 3, '基础金融场景', 2, '客服称征信异常', '接到"京东金融"客服电话："您的学生账户需注销，否则影响征信。请配合操作，将借款额度提现转到指定账户完成注销。"', '{"type":"chat","avatar":"kefu_fake","bg":"chat_bg","emotion":"严肃"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 150, 100, 0.5, 10),
('ZX002', '交互事件类', '冒充公检法诈骗', 'Information', 3, '职场入职场景', 3, '征信修复骗局', '网上找到"征信修复机构"，对方说交 5000 元"内部渠道费"可以消除逾期记录。要求先付款，承诺 7 个工作日见效。', '{"type":"task","style":"service_ad","highlight":"征信修复"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 5000, 150, 5000, 0.7, 10);

-- === 补充事件 (覆盖更多场景) ===
INSERT INTO riskEvents (event_id, event_type, fraud_type, briskly_point, risk_level, scene_type, min_role_level, title, content, style_config, button_config, cost_invest, success_reward, fail_penalty, fail_penalty_rate, anti_fraud_id) VALUES
('GF001', '按键类', '虚假购物投资诈骗', 'Low-cost', 1, '校园权限场景', 1, '食堂充值优惠', '学校食堂门口海报："扫码进群，充值 100 送 50，限时优惠！"二维码指向个人微信。', '{"type":"button","style":"poster","text":"扫码进群"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 50, 30, 0.3, 4),
('GF002', '弹窗类', '虚假购物投资诈骗', 'Yank', 2, '消费维权场景', 1, '快递理赔', '【短信通知】您的快递丢失，点击链接申请双倍理赔。页面要求填写银行卡信息和验证码。', '{"type":"alert","style":"sms_fake","icon":"package"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 100, 50, 0.3, 4),
('GF003', '社交聊天类', '交友恋爱诈骗', 'Kickback', 2, '社交福利场景', 2, '理财大师带单', '微信群里"理财大师"分享股票/基金，晒收益图，说"跟着我投，稳赚不赔"。私下推荐某平台。', '{"type":"chat","avatar":"master_fake","bg":"group_bg"}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 1000, 100, 1000, 0.5, 3),
('GF004', '场景界面类', '仿冒网站 APP 诈骗', 'Spoofing', 2, '职场入职场景', 2, '虚假招聘网站', '求职时搜索到"知名公司招聘"，网站要求先交"培训费""服装费""保证金"共 3000 元，承诺入职后退还。', '{"type":"interface","style":"recruit_fake","elements":["费用说明","支付入口"]} ', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 3000, 150, 3000, 0.6, 6),
('GF005', '文档表单类', '虚假购物投资诈骗', 'Information', 1, '校园权限场景', 1, '调查问卷陷阱', '"学校调研"要求填写详细家庭信息：父母工作、收入、家庭住址、银行卡号等，声称"用于贫困生评定"。', '{"type":"form","style":"survey","fields":["父母工作","家庭收入","家庭住址","银行卡号"]}', '{"buttons":[{"text":"安全","risk":1},{"text":"低风险","risk":2},{"text":"高风险","risk":3}]}', 0, 50, 30, 0.3, 2);
