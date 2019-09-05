const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { onLoad, onUnload } = pageOpt

    pageOpt.onLoad = function (opt) {
      const targetPage = this
      const dataFromStore = dataFn.call(targetPage, storeMap, opt)
      const originalData = cloneObj(dataFromStore)

      notifyStack.push([targetPage, dataFn.bind(targetPage), originalData])
      this.setData(Object.assign({}, this.data, dataFromStore))

      onLoad && onLoad.call(this, opt)
    }

    pageOpt.onUnload = function () {
      notifyStack.pop()
      onUnload && onUnload.call(this)
    }

    return pageOpt
  }
}
