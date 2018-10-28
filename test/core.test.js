const sinon = require('sinon')
const chai = require('chai')
chai.should()

const { notifyUpdate } = require('../src/core')
const { notifyStack } = require('../src/constant')

let spy
describe('Core', () => {
  before(done => {
    spy = sinon.spy()
    const targetPage = { setData: spy }
    const dataFn = () => ({})
    const oldData = { data: 'old' }
    new Array(10).fill('').forEach(() => notifyStack.push([targetPage, dataFn, oldData]))
    done()
  })

  after(done => {
    notifyStack.splice(0, notifyStack.length)
    done()
  })

  context('notifyUpdate', () => {
    it('should call setData for every pages in notifyStack', done => {
      new Array(100).fill('').forEach(() => notifyUpdate())
      setTimeout(() => {
        spy.callCount.should.equal(10)
        done()
      }, 100)
    })
  })
})
