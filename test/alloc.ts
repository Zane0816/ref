import ref, { alloc, types } from '../lib/ref-ts'
import { equal, strictEqual } from 'assert'

describe('alloc()', function() {
  it('should return a new Buffer of "bool" size', function() {
    const buf = alloc(types.bool)
    equal(ref.sizeof.bool, buf.length)
  })

  it('should coerce string type names', function() {
    const buf = alloc('bool')
    strictEqual(types.bool, buf.type)
  })
})
