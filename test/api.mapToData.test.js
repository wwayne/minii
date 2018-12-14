const chai = require('chai')
chai.should()

const { mapToData } = require('../src')
const { notifyStack } = require('../src/constant')

describe('API mapToData', () => {
  after((done) => {
    notifyStack.splice(0, notifyStack.length)
    done()
  })

  context('mapping page data', () => {
    it('should add new page data', (done) => {
      const pageOpt = {
        data: {
          name: 'wwayne'
        }
      }
      const dataFn = () => ({ where: 'sh' })

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.data.should.have.property('name', 'wwayne')
      newPageOpt.data.should.have.property('where', 'sh')
      done()
    })

    it('should cover original page data if same key from dataFn', (done) => {
      const pageOpt = {
        data: {
          name: 'wwayne'
        }
      }
      const dataFn = () => ({
        name: {
          first: 'w',
          last: 'wayne'
        }
      })

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.data.name.should.have.property('first', 'w')
      newPageOpt.data.name.should.have.property('last', 'wayne')
      done()
    })
  })

  context('page lifecycle injecting', () => {
    it('should update notifyStack with page load and unload', (done) => {
      const pageOpt = { setData: () => {} }
      const dataFn = () => ({})

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)

      newPageOpt.onReady()
      newPageOpt.onReady()
      notifyStack.should.have.lengthOf(2)
      newPageOpt.onUnload()
      notifyStack.should.have.lengthOf(1)
      done()
    })

    it('should setData when page load', (done) => {
      let called = false
      const pageOpt = { setData: () => { called = true } }
      const dataFn = () => ({})

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.onReady()
      called.should.equal(true)

      done()
    })
  })
})
