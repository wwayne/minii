const { storeMap, notifyStack } = require('./constant')
const { isEqualObj, cloneObj } = require('./utils')

const timeout = 5
let batch = 0

exports.notifyUpdate = function () {
  batch++
  setTimeout(() => {
    if (--batch === 0) {
      const len = notifyStack.length
      for (let i = len - 1; i >= 0; i--) {
        const [targetPage, dataFn, oldData] = notifyStack[i]
        const newData = dataFn(storeMap)
        if (!isEqualObj(oldData, newData)) {
          notifyStack[i][2] = cloneObj(newData)
          targetPage.setData(newData)
        }
      }
    }
  }, timeout)
}
