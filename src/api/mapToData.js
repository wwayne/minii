const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { onReady, onUnload } = pageOpt

    pageOpt.onReady = function () {
      const targetPage = this
      const dataFromStore = dataFn(storeMap)
      targetPage.setData(Object.assign({}, this.data, dataFromStore))
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
