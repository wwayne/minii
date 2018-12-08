const chai = require('chai')
chai.should()

const { isEqualObj, cloneObj } = require('../src/utils')

describe('Utils', () => {
  context('isEqualObj', () => {
    it('should return true if two objects have same content', done => {
      const obj1 = {
        a: 'a',
        b: {
          c: 'c',
          d: ['d', 1]
        }
      }
      const obj2 = {
        a: 'a',
        b: {
          c: 'c',
          d: ['d', 1]
        }
      }
      isEqualObj(obj1, obj2).should.equal(true)
      done()
    })

    it('should return false if two objects are different', (done) => {
      const obj1 = {
        a: 'a',
        b: ['b']
      }
      const obj2 = {
        a: 'a',
        b: 'b'
      }
      isEqualObj(obj1, obj2).should.equal(false)
      done()
    })
  })

  context('cloneObj', () => {
    it('should deep copy object', (done) => {
      const obj = {
        a: 'a',
        b: {
          c: 'c',
          d: ['d', 1]
        }
      }
      const clone = cloneObj(obj)
      isEqualObj(obj, clone).should.equal(true)

      clone.b.c = 'cccc'
      obj.b.should.have.property('c', 'c')
      clone.b.should.have.property('c', 'cccc')
      done()
    })
  })
})
