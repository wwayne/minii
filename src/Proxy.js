const { system } = wx.getSystemInfoSync()

if (/ios/i.test(system)) {
  module.exports = Proxy
} else {
  // TODO: unit testing
  module.exports = function (obj, handler) {
    const proxyObj = Object.create(obj.constructor.prototype, {
      '__proxyhandler__': {
        value: handler
      }
    })
    Object.keys(obj).forEach(key => {
      Object.defineProperty(proxyObj, key, {
        enumerable: true,
        get: function () { return this.__proxyhandler__.get(obj, key) },
        set: function (value) { return this.__proxyhandler__.set(obj, key, value) }
      })
    })
    return proxyObj
  }
}
