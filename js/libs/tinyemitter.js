/**
 * 极简事件发射器 (250 B)
 * 参照官方 minigame-1 同名文件
 */
function Emitter() {}
Emitter.prototype = {
  on(name, fn, ctx) {
    const e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({ fn, ctx });
    return this;
  },
  once(name, fn, ctx) {
    const self = this;
    function wrapper(...args) {
      self.off(name, wrapper);
      fn.apply(ctx, args);
    }
    wrapper._ = fn;
    return this.on(name, wrapper, ctx);
  },
  emit(name, ...args) {
    const list = (this.e || {})[name];
    if (!list) return this;
    list.slice().forEach(item => item.fn.apply(item.ctx, args));
    return this;
  },
  off(name, fn) {
    const list = (this.e || {})[name];
    if (!list) return this;
    const keep = fn ? list.filter(item => item.fn !== fn && item.fn._ !== fn) : [];
    keep.length ? (this.e[name] = keep) : delete this.e[name];
    return this;
  }
};

export default Emitter;
