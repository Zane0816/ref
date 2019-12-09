import ref, { coerceType, CreateRefBuffer, writeObject } from '../lib/index'
import { deepEqual, strictEqual, strict as assert, throws } from 'assert'
// import weak from 'weak'

describe('Object', function() {
  const obj = {
    foo: 'bar',
    test: Math.random(),
    now: new Date(),
  }

  // beforeEach(gc)

  it('should write and read back an Object in a Buffer', function() {
    const buf = Buffer.alloc(ref.sizeof.Object)
    writeObject(CreateRefBuffer(buf, coerceType('Object')), 0, obj, false)
    const out = ref.readObject(buf)
    strictEqual(obj, out)
    deepEqual(obj, out)
  })

  it('should retain references to written Objects', function(done) {
    let o_gc = false
    let buf_gc = false
    let o: any = { foo: 'bar' }
    let buf = Buffer.alloc(ref.sizeof.Object)

    // weak(o, function() {
    //   o_gc = true
    // })
    // weak(buf, function() {
    //   buf_gc = true
    // })
    writeObject(CreateRefBuffer(buf, coerceType('Object')), 0, o, false)
    assert(!o_gc, '"o" has been garbage collected too soon')
    assert(!buf_gc, '"buf" has been garbage collected too soon')

    // try to GC `o`
    o = null
    // gc()
    assert(!o_gc, '"o" has been garbage collected too soon')
    assert(!buf_gc, '"buf" has been garbage collected too soon')

    // now GC `buf`
    // @ts-ignore
    buf = null
    setImmediate(function() {
      // gc()
      assert(buf_gc, '"buf" has not been garbage collected')
      assert(o_gc, '"o" has not been garbage collected')
      done()
    })
  })

  it('should throw an Error when reading an Object from the NULL pointer', function() {
    throws(function() {
      // @ts-ignore
      ref.NULL.readObject()
    })
  })

  describe('offset', function() {
    it('should read two Objects next to each other in memory', function() {
      const buf = CreateRefBuffer(Buffer.alloc(ref.sizeof.pointer * 2), coerceType('void'))
      const a = {}
      const b = {}
      buf.writeObject(a, 0 * ref.sizeof.pointer)
      buf.writeObject(b, 1 * ref.sizeof.pointer)
      const _a = buf.readObject(0 * ref.sizeof.pointer)
      const _b = buf.readObject(1 * ref.sizeof.pointer)
      strictEqual(a, _a)
      strictEqual(b, _b)
    })
  })
})
