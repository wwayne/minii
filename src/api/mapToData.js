const { storeMap, notifyStack } = require('../constant')
const { cloneObj } = require('../utils')

module.exports = function (dataFn) {
  return function (pageOpt) {
    const { onLoad, onUnload, attached, detached, lifetimes } = pageOpt

    function mount (opt) {
      const targetPage = this
      const dataFromStore = dataFn.call(targetPage, storeMap, opt)
      const originalData = cloneObj(dataFromStore)

      notifyStack.push([targetPage, dataFn.bind(targetPage), originalData, opt])
      this.setData(Object.assign({}, this.data, dataFromStore))

      onLoad && onLoad.call(this, opt)
      attached && attached.call(this, opt)
      lifetimes && lifetimes.attached && lifetimes.attached.call(this, opt)
    }

    function unmount () {
      notifyStack.pop()
      onUnload && onUnload.call(this)
      detached && detached.call(this)
      lifetimes && lifetimes.detached && lifetimes.detached.call(this)
    }

    pageOpt.onLoad = pageOpt.attached = mount
    pageOpt.onUnload = pageOpt.detached = unmount
    if (lifetimes) {
      lifetimes.attached = mount
      lifetimes.detached = unmount
    }

    return pageOpt
  }
}
