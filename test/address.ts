import ref, { coerceType, CreateRefBuffer } from '../lib/ref-ts'
import { strictEqual, equal, strict as assert } from 'assert'
import { inspect } from 'util'

describe('address', function() {
  const buf = CreateRefBuffer(Buffer.from('hello'), coerceType('void'))

  it('should return 0 for the NULL pointer', function() {
    strictEqual(0, ref.address(ref.NULL))
  })

  it('should give a positive value for any other Buffer', function() {
    const address = ref.address(buf)
    equal(typeof address, 'number')
    assert(isFinite(address))
    assert(address > 0)
  })

  it('should accept an offset value for the 2nd argument', function() {
    const address = ref.address(buf)
    equal(address + 0, ref.address(buf, 0))
    equal(address + 1, ref.address(buf, 1))
    equal(address + 2, ref.address(buf, 2))
    equal(address + 3, ref.address(buf, 3))
    equal(address + 4, ref.address(buf, 4))
    equal(address + 5, ref.address(buf, 5))
  })

  it('should accept a negative offset value for the 2nd argument', function() {
    const address = ref.address(buf)
    equal(address - 0, ref.address(buf, -0))
    equal(address - 1, ref.address(buf, -1))
    equal(address - 2, ref.address(buf, -2))
    equal(address - 3, ref.address(buf, -3))
    equal(address - 4, ref.address(buf, -4))
    equal(address - 5, ref.address(buf, -5))
  })

  it('should have an offset of zero when none is given', function() {
    equal(ref.address(buf), ref.address(buf, 0))
  })

  describe('inspect()', function() {
    it('should overwrite the default Buffer#inspect() to print the memory address', function() {
      assert(inspect(buf).indexOf(buf.hexAddress()) !== -1)
    })
  })
})
