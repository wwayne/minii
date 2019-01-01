const sinon = require('sinon')
const chai = require('chai')
chai.should()

const { mapToData } = require('../src')
const { notifyStack } = require('../src/constant')

describe('API mapToData', () => {
  beforeEach(done => {
    notifyStack.splice(0, notifyStack.length)
    done()
  })
  after((done) => {
    notifyStack.splice(0, notifyStack.length)
    done()
  })

  context('mapping page data', () => {
    it('should add new page data', (done) => {
      const pageOpt = {
        data: {
          name: 'wwayne'
        },
        setData: function (data) { this.data = data }
      }
      const dataFn = () => ({ where: 'sh' })

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.onLoad()
      newPageOpt.data.should.have.property('name', 'wwayne')
      newPageOpt.data.should.have.property('where', 'sh')
      done()
    })

    it('should cover original page data if same key from dataFn', (done) => {
      const pageOpt = {
        data: {
          name: 'wwayne'
        },
        setData: function (data) { this.data = data }
      }
      const dataFn = () => ({
        name: {
          first: 'w',
          last: 'wayne'
        }
      })

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.onLoad()
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

      newPageOpt.onLoad()
      newPageOpt.onLoad()
      notifyStack.should.have.lengthOf(2)
      newPageOpt.onUnload()
      notifyStack.should.have.lengthOf(1)
      done()
    })

    it('should setData when page load', (done) => {
      const stub = sinon.stub().returns({})
      const pageOpt = { setData: stub }
      const dataFn = () => ({})

      const connect = mapToData(dataFn)
      const newPageOpt = connect(pageOpt)
      newPageOpt.onLoad()

      stub.calledOnce.should.equal(true)
      done()
    })
  })
})
