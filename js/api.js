/**
 * HTTP 请求封装
 * 所有与后端通信都在此中转
 */

const API_BASE = 'http://hulegeyou.yiouxiaozhan.top/api';

/**
 * 通用 request
 * @param {string}   options.url    路径（会拼 API_BASE）
 * @param {string}   options.method GET / POST / PUT / DELETE
 * @param {object}   options.data   请求 body / query
 * @param {object}   options.headers 自定义头部
 */
function request(options) {
  const url = options.url.startsWith('http') ? options.url : API_BASE + options.url;
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.headers || { 'Content-Type': 'application/json' },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败(${res.statusCode}): ${JSON.stringify(res.data)}`));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

/**
 * 封装常用的后端 API 方法
 */
const api = {
  /** 用户登录 */
  login(openid, nickname) {
    return request({
      url: '/user/login',
      method: 'POST',
      data: { openid, nickname }
    });
  },

  /** 开始关卡 */
  startLevel(openid, sceneType, level) {
    return request({
      url: '/game/start',
      method: 'POST',
      data: { openid, sceneType, level }
    });
  },

  /** 提交事件判断 */
  submitEvent(openid, eventId, userChoice, investedGold) {
    return request({
      url: '/game/submitEvent',
      method: 'POST',
      data: { openid, eventId, userChoice, investedGold }
    });
  },

  /** 完成关卡 */
  finishLevel(openid, sceneType, eventsTotal, eventsSuccess, goldChange, result) {
    return request({
      url: '/game/finish',
      method: 'POST',
      data: { openid, sceneType, eventsTotal, eventsSuccess, goldChange, result }
    });
  },

  /** 购买道具 */
  buyProp(openid, propId) {
    return request({
      url: '/user/buyProp',
      method: 'POST',
      data: { openid, propId, propType: propId }
    });
  },

  /** 消耗道具 */
  consumeProp(openid, propId) {
    return request({
      url: '/user/consumeProp',
      method: 'POST',
      data: { openid, propId }
    });
  },

  /** 观看广告领金币 */
  watchAd(openid) {
    return request({
      url: '/ad/watch',
      method: 'POST',
      data: { openid }
    });
  },

  /** 创建分享 */
  createShare(openid, helpType) {
    return request({
      url: '/share/create',
      method: 'POST',
      data: { openid, helpType }
    });
  }
};

export { request, API_BASE };
export default api;
