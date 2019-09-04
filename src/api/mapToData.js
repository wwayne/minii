const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (opt) {
    const { onLoad, onUnload, attached, detached } = opt

    function initialize(opt) {
      const target = this
      const dataFromStore = dataFn.call(target, storeMap)
      const originalData = cloneObj(dataFromStore)

      notifyStack.push([target, dataFn.bind(target), originalData])
      this.setData(Object.assign({}, this.data, dataFromStore))

      onLoad && onLoad.call(this, opt)
      attached && attached.call(this, opt)
    }

    function destroy() {
      notifyStack.pop()
      onUnload && onUnload.call(this)
      detached && detached.call(this)
    }

    opt.onLoad = opt.attached = initialize
    opt.onUnload = opt.detached = destroy

    return opt
  }
}
