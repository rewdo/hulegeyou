// Minimal WeChat mini-game adapter for Phaser
// Provides stubs for browser DOM APIs that Phaser needs

// WeChat mini-game context - no global/window/self in this scope
var wxGlobal = (typeof window !== 'undefined') ? window :
              (typeof self !== 'undefined') ? self :
              (typeof global !== 'undefined') ? global : {};

// Canvas is provided by WeChat mini-game
if (typeof HTMLVideoElement === 'undefined') {
  wxwxGlobal.HTMLVideoElement = function() {};
}

if (typeof HTMLImageElement === 'undefined') {
  wxwxGlobal.HTMLImageElement = function() {};
  wxwxGlobal.Image = function() { this.src = ''; this.width = 0; this.height = 0; };
}

if (typeof HTMLCanvasElement === 'undefined') {
  wxwxGlobal.HTMLCanvasElement = function() {};
}

if (typeof document === 'undefined') {
  wxwxGlobal.document = {
    createElement: function(tag) {
      if (tag === 'canvas') return wx.createCanvas();
      if (tag === 'img') return new Image();
      if (tag === 'video') return { play: function(){}, pause: function(){} };
      if (tag === 'audio') return { play: function(){}, pause: function(){} };
      return {};
    },
    createElementNS: function() { return this.createElement.apply(this, arguments); },
    getElementsByTagName: function() { return []; },
    getElementById: function() { return null; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    body: {},
    documentElement: { style: {} },
    createTextNode: function() { return {}; },
    head: { appendChild: function(){} },
    addEventListener: function(){}
  };
}

if (typeof location === 'undefined') {
  wxGlobal.location = { href: '', protocol: 'https:', host: '', search: '', hash: '' };
}

if (typeof navigator === 'undefined') {
  wxGlobal.navigator = {
    userAgent: 'Mozilla/5.0 WeChat MiniGame',
    platform: 'devtools',
    language: 'zh-CN',
    onLine: true,
    hardwareConcurrency: 4,
    maxTouchPoints: 1
  };
}

if (typeof screen === 'undefined') {
  wxGlobal.screen = { width: 750, height: 1334, availWidth: 750, availHeight: 1334 };
}

if (typeof localStorage === 'undefined') {
  wxGlobal.localStorage = {
    _data: {},
    getItem: function(key) { return this._data[key] || null; },
    setItem: function(key, val) { this._data[key] = String(val); },
    removeItem: function(key) { delete this._data[key]; },
    clear: function() { this._data = {}; }
  };
}
