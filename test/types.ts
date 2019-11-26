import { derefType, refType, types } from '../lib/ref-ts'
import { strict as assert, equal, throws } from 'assert'

describe('types', function() {
  describe('refType()', function() {
    it('should return a new "type" with its `indirection` level increased by 1', function() {
      const int = types.int
      const intPtr = refType(int)
      equal(int.size, intPtr.size)
      equal(int.indirection + 1, intPtr.indirection)
    })

    it('should coerce string types', function() {
      const intPtr = refType('int')
      equal(2, intPtr.indirection)
      equal(intPtr.size, types.int.size)
    })

    it('should override and update a read-only name property', function() {
      // a type similar to ref-struct's StructType
      // used for types refType name property test
      function StructType() {}
      StructType.size = 0
      StructType.indirection = 0

      // read-only name property
      // @ts-ignore
      equal(StructType.name, 'StructType')
      try {
        // @ts-ignore
        StructType.name = 'foo'
      } catch (err) {
        // ignore
      }
      // @ts-ignore
      equal(StructType.name, 'StructType')

      // name property should be writable and updated
      // @ts-ignore
      const newObj = refType(StructType)
      const newProp = Object.getOwnPropertyDescriptor(newObj, 'name')
      equal(newProp!.writable, true)
      equal(newObj.name, 'StructType*')
    })
  })

  describe('derefType()', function() {
    it('should return a new "type" with its `indirection` level decreased by 1', function() {
      const intPtr = Object.create(types.int)
      intPtr.indirection++
      const int = derefType(intPtr)
      equal(intPtr.size, intPtr.size)
      equal(intPtr.indirection - 1, int.indirection)
    })

    it('should throw an Error when given a "type" with its `indirection` level already at 1', function() {
      throws(function() {
        derefType(types.int)
      })
    })
  })

  describe('size', function() {
    Object.keys(types).forEach(function(name) {
      if (name === 'void') return
      it('sizeof(' + name + ') should be >= 1', function() {
        // @ts-ignore
        const type = types[name]
        equal('number', typeof type.size)
        assert(type.size >= 1)
      })
    })
  })

  describe('alignment', function() {
    Object.keys(types).forEach(function(name) {
      if (name === 'void') return
      it('alignof(' + name + ') should be >= 1', function() {
        // @ts-ignore
        const type = types[name]
        equal('number', typeof type.alignment)
        assert(type.alignment >= 1)
      })
    })
  })
})
