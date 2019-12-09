import ref, { coerceType, CreateRefBuffer } from '../lib/index'
import { strictEqual, strict as assert, throws, equal } from 'assert'
// import weak from 'weak'

describe('pointer', function() {
  const test = new Buffer('hello world')

  // beforeEach(gc)

  it('should write and read back a pointer (Buffer) in a Buffer', function() {
    const buf = new Buffer(ref.sizeof.pointer)
    ref.writePointer(buf, 0, test)
    const out = ref.readPointer(buf, 0, test.length)
    strictEqual(out.length, test.length)
    for (let i = 0, l = out.length; i < l; i++) {
      strictEqual(out[i], test[i])
    }
    strictEqual(ref.address(out), ref.address(test))
  })

  it('should retain references to a written pointer in a Buffer', function(done) {
    let child_gc = false
    let parent_gc = false
    let child = new Buffer('a pointer holding some data...')
    let parent = new Buffer(ref.sizeof.pointer)

    // weak(child, function() {
    //   child_gc = true
    // })
    // weak(parent, function() {
    //   parent_gc = true
    // })
    ref.writePointer(parent, 0, child)
    assert(!child_gc, '"child" has been garbage collected too soon')
    assert(!parent_gc, '"parent" has been garbage collected too soon')

    // try to GC `child`
    // @ts-ignore
    child = null
    // gc()
    assert(!child_gc, '"child" has been garbage collected too soon')
    assert(!parent_gc, '"parent" has been garbage collected too soon')

    // now GC `parent`
    // @ts-ignore
    parent = null
    setImmediate(function() {
      // gc()
      assert(parent_gc, '"parent" has not been garbage collected')
      assert(child_gc, '"child" has not been garbage collected')
      done()
    })
  })

  it('should throw an Error when reading from the NULL pointer', function() {
    throws(function() {
      // @ts-ignore
      ref.NULL.readPointer()
    })
  })

  it('should return a 0-length Buffer when reading a NULL pointer', function() {
    const buf = new Buffer(ref.sizeof.pointer)
    ref.writePointer(buf, 0, ref.NULL)
    const out = ref.readPointer(buf, 0, 100)
    strictEqual(out.length, 0)
  })

  describe('offset', function() {
    it('should read two pointers next to each other in memory', function() {
      const buf = CreateRefBuffer(Buffer.alloc(ref.sizeof.pointer * 2), coerceType('void'))
      const a = CreateRefBuffer(Buffer.from('hello'), coerceType('void'))
      const b = CreateRefBuffer(Buffer.from('world'), coerceType('void'))
      buf.writePointer(a, 0 * ref.sizeof.pointer)
      buf.writePointer(b, 1 * ref.sizeof.pointer)
      const _a = CreateRefBuffer(buf.readPointer(0 * ref.sizeof.pointer), coerceType('void'))
      const _b = CreateRefBuffer(buf.readPointer(1 * ref.sizeof.pointer), coerceType('void'))
      equal(a.address(), _a.address())
      equal(b.address(), _b.address())
    })
  })
})
