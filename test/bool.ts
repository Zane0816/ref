import { alloc, get, set } from '../lib/ref-ts'
import { strictEqual } from 'assert'

describe('bool', function() {
  const buf = alloc('bool')

  it('should return JS "false" for a value of 0', function() {
    buf[0] = 0
    strictEqual(false, get(buf))
  })

  it('should return JS "true" for a value of 1', function() {
    buf[0] = 1
    strictEqual(true, get(buf))
  })

  it('should write a JS "false" value as 0', function() {
    set(buf, 0, false)
    strictEqual(0, buf[0])
  })

  it('should write a JS "true" value as 1', function() {
    set(buf, 0, true)
    strictEqual(1, buf[0])
  })

  it('should allow uint8 number values to be written to it', function() {
    const val = 255
    set(buf, 0, val)
    strictEqual(true, get(buf))
    strictEqual(val, buf[0])
  })
})
