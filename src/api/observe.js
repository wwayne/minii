const { storeMap } = require('../constant')
const { notifyUpdate } = require('../core')
const { cloneObj } = require('../utils')
const Proxy = require('../Proxy')

module.exports = function (storeInstance, storeName) {
  storeName = storeName || storeInstance.constructor.name.toLowerCase()
  const ownProps = Object.getOwnPropertyNames(storeInstance)

  if (!storeMap[storeName]) {
    storeMap[storeName] = cloneObj(storeInstance, ownProps)
  }

  return addProxy(storeInstance, storeMap[storeName])
}

const addProxy = (object, targetInStoreMap) => {
  Object.keys(object).forEach(key => {
    const type = Object.prototype.toString.call(object[key])
    if (type === '[object Object]' || type === '[object Array]') {
      object[key] = addProxy(object[key], targetInStoreMap[key])
      object[key].__isProxy = true
    }
  })

  return new Proxy(object, {
    get (target, key) {
      if (key === '__isProxy') return true
      if (target[key] && target[key].__isProxy) return target[key]
      return targetInStoreMap[key] || target[key]
    },
    set (target, key, value) {
      targetInStoreMap[key] = value
      notifyUpdate()
      return value
    }
  })
}
