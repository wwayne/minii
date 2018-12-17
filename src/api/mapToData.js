const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { onLoad, onReady, onUnload } = pageOpt

    pageOpt.onLoad = function (opt) {
      const dataFromStore = dataFn(storeMap)
      this.setData(Object.assign({}, this.data, dataFromStore))
      onLoad && onLoad.call(this, opt)
    }

    pageOpt.onReady = function () {
      const targetPage = this
      const originalData = cloneObj(dataFn(storeMap))
      notifyStack.push([targetPage, dataFn, originalData])
      onReady && onReady.call(this)
    }

    pageOpt.onUnload = function () {
      notifyStack.pop()
      onUnload && onUnload.call(this)
    }

    return pageOpt
  }
}
