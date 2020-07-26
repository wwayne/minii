const sinon = require('sinon')
const chai = require('chai')
const { expect } = chai
chai.should()

const { observe } = require('../src')
const { storeMap, notifyStack } = require('../src/constant')

class User {
  constructor () {
    this.name = 'wwayne'
    this.friends = [{
      name: 'cjt',
      pets: ['mocha']
    }]
    this.products = [{
      shoes: {
        isLoaded: false,
        data: [{ brand: 'nike', size: 41 }, { brand: 'adidas', size: 40.5 }]
      }
    }]
    this.extraInfo = {
      where: 'sh'
    }
    this.address = {} // { id: { data: [] } }
  }

  update () {
    this.name = 'wzx'
    this.friends[0].name = 'chengnanxiao'
    this.friends[0].pets[0] = 'mochacha'
  }

  addNewShoe (value) {
    this.shoes.push(value)
  }
}

let user
describe('API observe', () => {
  before((done) => {
    user = observe(new User())
    done()
  })
  after((done) => {
    Object.keys(storeMap).forEach((key) => delete storeMap[key])
    done()
  })

  it('should proxy get correctly', (done) => {
    user.name.should.equal('wwayne')
    user.friends[0].name.should.equal('cjt')
    user.friends[0].pets[0].should.equal('mocha')

    user.friends.__isProxy.should.equal(true)
    user.friends.__data.should.not.equal(undefined)
    Object.prototype.toString.call(user.update).should.equal('[object Function]')
    done()
  })

  it('should proxy set correctly', (done) => {
    const stub = sinon.stub().returns({})
    notifyStack.push([null, stub, {}])
    user.update()

    user.name.should.equal('wzx')
    user.friends[0].name.should.equal('chengnanxiao')
    user.friends[0].pets[0].should.equal('mochacha')

    setTimeout(() => {
      stub.calledOnce.should.equal(true)
      storeMap.user.name.should.equal('wzx')
      storeMap.user.friends[0].name.should.equal('chengnanxiao')
      storeMap.user.friends[0].pets[0].should.equal('mochacha')

      notifyStack.pop()
      done()
    }, 10)
  })

  it('should able to set to null or undefined', (done) => {
    user.name = null
    expect(user.name).to.be.a('null')

    user.name = undefined
    expect(user.name).to.be.an('undefined')

    done()
  })

  context('array', () => {
    beforeEach((done) => {
      user.products = [{
        shoes: {
          isLoaded: false,
          data: [{ brand: 'nike', size: 41 }, { brand: 'adidas', size: 40.5 }]
        }
      }]
      done()
    })

    it('should able to observe Array.push/shift and update', (done) => {
      const stub = sinon.stub().returns({})
      notifyStack.push([null, stub, {}])

      user.products[0].shoes.data.push({ brand: 'jordan' })
      user.products[0].shoes.data.length.should.equal(3)
      user.products[0].shoes.data[2].brand.should.equal('jordan')
      storeMap.user.products[0].shoes.data[0].should.have.property('brand', 'nike')

      user.products[0].shoes.data[2].brand = '3B'
      user.products[0].shoes.data[2].size = 40
      user.products[0].shoes.data[2].brand.should.equal('3B')
      user.products[0].shoes.data[2].size.should.equal(40)
      storeMap.user.products[0].shoes.data[2].should.have.property('brand', '3B')
      storeMap.user.products[0].shoes.data[2].should.have.property('size', 40)

      user.products[0].shoes.data.shift()
      user.products[0].shoes.data.length.should.equal(2)
      user.products[0].shoes.data[0].brand.should.equal('adidas')

      setTimeout(() => {
        stub.calledOnce.should.equal(true)
        storeMap.user.products[0].shoes.data.should.be.lengthOf(2)
        storeMap.user.products[0].shoes.data[0].should.have.property('brand', 'adidas')
        storeMap.user.products[0].shoes.data[1].should.have.property('brand', '3B')
        storeMap.user.products[0].shoes.data[1].should.have.property('size', 40)

        notifyStack.pop()
        done()
      }, 10)
    })

    it('should able to observe Array.splice', (done) => {
      const stub = sinon.stub().returns({})
      notifyStack.push([null, stub, {}])

      user.products[0].shoes.data.push({ brand: 'jordan' })
      user.products[0].shoes.data.length.should.equal(3)

      user.products[0].shoes.data.splice(0, 1)
      user.products[0].shoes.data.length.should.equal(2)
      user.products[0].shoes.data[0].brand.should.equal('adidas')
      user.products[0].shoes.data[1].brand.should.equal('jordan')

      setTimeout(() => {
        stub.calledOnce.should.equal(true)
        storeMap.user.products[0].shoes.data.should.be.lengthOf(2)
        storeMap.user.products[0].shoes.data[0].should.have.property('brand', 'adidas')
        storeMap.user.products[0].shoes.data[1].should.have.property('brand', 'jordan')

        notifyStack.pop()
        done()
      }, 10)
    })

    it('should able to observe Array.concat', (done) => {
      const stub = sinon.stub().returns({})
      notifyStack.push([null, stub, {}])

      user.address['test'] = { data: [] }
      user.address['test'].data = user.address['test'].data.concat(['id1'])

      setTimeout(() => {
        stub.calledOnce.should.equal(true)
        storeMap.user.address['test'].data[0].should.equal('id1')

        notifyStack.pop()
        done()
      }, 10)
    })
  })

  context('object', () => {
    beforeEach((done) => {
      user.extraInfo = {
        where: 'sh'
      }
      done()
    })

    it('should abserve when new attr added to an object', (done) => {
      const stub = sinon.stub().returns({})
      notifyStack.push([null, stub, {}])

      user.extraInfo.born = 'xj'
      user.extraInfo.school = { name: 'ecust' }

      setTimeout(() => {
        stub.calledOnce.should.equal(true)
        storeMap.user.extraInfo.should.have.property('born', 'xj')
        storeMap.user.extraInfo.school.should.deep.equal({ name: 'ecust' })

        notifyStack.pop()
        done()
      }, 10)
    })

    it('should able to delete a key', (done) => {
      const stub = sinon.stub().returns({})
      notifyStack.push([null, stub, {}])

      user.extraInfo.gf = { name: 'jt' }
      delete user.extraInfo.gf

      setTimeout(() => {
        stub.calledOnce.should.equal(true)
        storeMap.user.extraInfo.should.not.have.property('gf')
        const typeOfAttr = typeof user.extraInfo.gf
        typeOfAttr.should.be.equal('undefined')

        notifyStack.pop()
        done()
      }, 10)
    })
  })
})
