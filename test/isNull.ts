import ref from '../lib/index'
import { strictEqual } from 'assert'

describe('isNull', function() {
  it('should return "true" for the NULL pointer', function() {
    strictEqual(true, ref.isNull(ref.NULL))
  })

  it('should return "false" for a valid Buffer', function() {
    const buf = new Buffer('hello')
    strictEqual(false, ref.isNull(buf))
  })
})
