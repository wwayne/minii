const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { data, onReady, onUnload } = pageOpt
    const dataFromStore = dataFn(storeMap)

    pageOpt.data = Object.assign({}, data, dataFromStore)

    pageOpt.onReady = function () {
      const targetPage = this
      notifyStack.push([targetPage, dataFn, cloneObj(dataFromStore)])
      onReady && onReady.call(this)
    }

    pageOpt.onUnload = function () {
      notifyStack.pop()
      onUnload && onUnload.call(this)
    }

    return pageOpt
  }
}
