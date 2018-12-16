const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { data, onReady, onUnload } = pageOpt

    pageOpt.data = Object.assign({}, data, dataFn(storeMap))

    pageOpt.onReady = function () {
      const targetPage = this
      const dataFromStore = dataFn(storeMap)

      // 通知 stack
      notifyStack.push([targetPage, dataFn, cloneObj(dataFromStore)])
      
      // 新页面的数据和 store 同步
      const currentData = Object.assign({}, data, dataFromStore)
      targetPage.setData(currentData)

      onReady && onReady.call(this)
    }

    pageOpt.onUnload = function () {
      notifyStack.pop()
      onUnload && onUnload.call(this)
    }

    return pageOpt
  }
}
