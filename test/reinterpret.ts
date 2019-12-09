import { CreateRefBuffer } from '../lib'
import { strictEqual, strict as assert } from 'assert'
// import weak from 'weak'

describe('reinterpret()', function() {
  // beforeEach(gc)

  it('should return a new Buffer instance at the same address', function() {
    const buf = CreateRefBuffer(Buffer.from('hello world'))
    const small = CreateRefBuffer(buf.slice(0, 0))
    strictEqual(0, small.length)
    strictEqual(buf.address(), small.address())
    const reinterpreted = CreateRefBuffer(small.reinterpret(buf.length))
    strictEqual(buf.address(), reinterpreted.address())
    strictEqual(buf.length, reinterpreted.length)
    strictEqual(buf.toString(), reinterpreted.toString())
  })

  it('should return a new Buffer instance starting at the offset address', function() {
    const buf = CreateRefBuffer(Buffer.from('hello world'))
    const offset = 3
    const small = CreateRefBuffer(buf.slice(offset, buf.length))
    strictEqual(buf.length - offset, small.length)
    strictEqual(buf.address() + offset, small.address())
    const reinterpreted = CreateRefBuffer(buf.reinterpret(small.length, offset))
    strictEqual(small.address(), reinterpreted.address())
    strictEqual(small.length, reinterpreted.length)
    strictEqual(small.toString(), reinterpreted.toString())
  })

  it('should retain a reference to the original Buffer when reinterpreted', function() {
    const origGCd = false
    const otherGCd = false
    let buf = CreateRefBuffer(Buffer.alloc(1))
    // weak(buf, function() {
    //   origGCd = true
    // })
    let other = buf.reinterpret(0)
    // weak(other, function() {
    //   otherGCd = true
    // })

    assert(!origGCd, '"buf" has been garbage collected too soon')
    assert(!otherGCd, '"other" has been garbage collected too soon')

    // try to GC `buf`
    // @ts-ignore
    buf = null
    // gc()
    assert(!origGCd, '"buf" has been garbage collected too soon')
    assert(!otherGCd, '"other" has been garbage collected too soon')

    // now GC `other`
    // @ts-ignore
    other = null
    // gc()
    assert(otherGCd, '"other" has not been garbage collected')
    assert(origGCd, '"buf" has not been garbage collected')
  })
})
