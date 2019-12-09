import nodeRef, { ref, deref, types, alloc, CreateRefBuffer, coerceType } from '../lib/index'
import { equal, strictEqual, throws } from 'assert'

describe('ref(), deref()', function() {
  // beforeEach(gc)

  it('should work 1 layer deep', function() {
    const test = CreateRefBuffer(Buffer.from('one layer deep'))
    const one = ref(test)
    const _test = deref(one)
    equal(test.length, _test.length)
    equal(test.toString(), _test.toString())
  })

  it('should work 2 layers deep', function() {
    const test = CreateRefBuffer(Buffer.from('two layers deep'))
    const one = ref(test)
    const two = ref(one)
    const _one = deref(two)
    const _test = deref(_one)
    equal(nodeRef.address(one), nodeRef.address(_one))
    equal(nodeRef.address(test), nodeRef.address(_test))
    equal(one.length, _one.length)
    equal(test.length, _test.length)
    equal(test.toString(), _test.toString())
  })

  it('should throw when derefing a Buffer with no "type"', function() {
    const test = CreateRefBuffer(Buffer.from('???'))
    throws(function() {
      deref(test)
    }, /unknown "type"/)
  })

  it('should throw when derefing a Buffer with no "type" 2', function() {
    const test = CreateRefBuffer(Buffer.from('???'))
    const r = ref(test)
    const _test = deref(r)
    equal(nodeRef.address(test), nodeRef.address(_test))
    throws(function() {
      deref(_test)
    }, /unknown "type"/)
  })

  it('should deref() a "char" type properly', function() {
    const test = CreateRefBuffer(Buffer.alloc(nodeRef.sizeof.char), coerceType('char'))
    test.type = types.char
    test[0] = 50
    equal(50, deref(test))
    test[0] = 127
    equal(127, deref(test))
  })

  it('should not throw when calling ref()/deref() on a `void` type', function() {
    const test = alloc(types.void)
    strictEqual(null, test.deref())
  })
})
