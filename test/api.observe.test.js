const chai = require('chai')
chai.should()

const { observe } = require('../src')
const { storeMap } = require('../src/constant')

class User {
  constructor () {
    this.name = 'wwayne'
    this.friends = [{
      name: 'cjt',
      pets: ['mocha']
    }]
  }

  update () {
    this.name = 'wzx'
    this.friends[0].name = 'chengnanxiao'
    this.friends[0].pets[0] = 'mochacha'
  }
}

let user
describe('API observe', () => {
  before(done => {
    user = observe(new User())
    done()
  })

  after(done => {
    Object.keys(storeMap).forEach(key => {
      delete storeMap[key]
    })
    done()
  })

  it('should proxy get correctly', done => {
    user.name.should.equal('wwayne')
    user.friends[0].name.should.equal('cjt')
    user.friends[0].pets[0].should.equal('mocha')
    Object.prototype.toString.call(user.update).should.equal('[object Function]')
    done()
  })

  it('should proxy set correctly', done => {
    user.update()

    user.name.should.equal('wzx')
    user.friends[0].name.should.equal('chengnanxiao')
    user.friends[0].pets[0].should.equal('mochacha')
    done()
  })
})
