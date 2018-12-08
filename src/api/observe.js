const { storeMap } = require('../constant')
const { notifyUpdate } = require('../core')
const { cloneObj, isProxyNeeded } = require('../utils')
const Proxy = require('../libs/Proxy')

module.exports = function (storeInstance, storeName) {
  storeName = storeName || storeInstance.constructor.name.toLowerCase()
  const ownProps = Object.getOwnPropertyNames(storeInstance)

  if (!storeMap[storeName]) {
    storeMap[storeName] = cloneObj(storeInstance, ownProps)
  }

  return addProxy(storeInstance, [storeName])
}

const addProxy = (object, keys) => {
  Object.keys(object).forEach(key => {
    if (isProxyNeeded(object[key])) {
      object[key] = addProxy(object[key], keys.concat([key]))
    }
  })

  return new Proxy(object, {
    get (target, key) {
      if (key === '__isProxy') return true
      if (key === '__original') return findInStoreMap(keys)
      const targetValue = Reflect.get(target, key)
      if (targetValue && targetValue.__isProxy) return targetValue
      const valueInStoreMap = findInStoreMap(keys.concat([key]))
      return valueInStoreMap !== undefined && valueInStoreMap || targetValue
    },
    set (target, key, value) {
      if (key === '__isProxy') return true
      const pureValue = value.__isProxy && value.__original || value
      const objectValue = isProxyNeeded(pureValue) && addProxy(cloneObj(pureValue), keys.concat([key])) || pureValue
      const res = Reflect.set(target, key, objectValue)
      setValueInStoreMap(keys.concat([key]), pureValue)
      notifyUpdate()
      return res
    }
  })
}

const findInStoreMap = (keys) => {
  return keys.reduce((acc, key) => {
    return acc && acc[key] || undefined
  }, storeMap)
}

const setValueInStoreMap = (keys, value) => {
  const len = keys.length
  const lastKey = keys[len - 1]
  let target = storeMap
  keys.forEach((key, index) => {
    if (index === len - 1) return
    target = target[key]
  })
  target[lastKey] = value
}
