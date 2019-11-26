import ref, { coerceType, getType, types, get, set, CreateRefBuffer } from '../lib/ref-ts'
import { equal, strictEqual, throws, strict as assert } from 'assert'

describe('coerce', function() {
  it('should return `ref.types.void` for "void"', function() {
    const type = coerceType('void')
    strictEqual(types.void, type)
  })

  it('should return a ref type when a "*" is present', function() {
    const type = coerceType('void *')
    assert(type !== types.void)
    equal(type.indirection, types.void.indirection + 1)
  })

  it('should coerce the "type" property of a Buffer', function() {
    const buf = CreateRefBuffer(Buffer.alloc(ref.sizeof.int), coerceType('int'))
    const type = getType(buf)
    strictEqual(types.int, type)
    strictEqual('int', buf.type.name)
  })

  it('should coerce "Object" to `ref.types.Object`', function() {
    strictEqual(types.Object, coerceType('Object'))
  })

  it('should coerce the optional type in `ref.get()`', function() {
    const b = new Buffer(ref.sizeof.int8)
    b[0] = 5
    strictEqual(5, get(CreateRefBuffer(b, coerceType('int8')), 0, 'int8'))
  })

  it('should coerce the optional type in `ref.set()`', function() {
    const b = new Buffer(ref.sizeof.int8)
    set(CreateRefBuffer(b, coerceType('int8')), 0, 5, 'int8')
    strictEqual(5, b[0])
  })

  it('should throw a TypeError if a "type" can not be inferred', function() {
    throws(function() {
      // @ts-ignore
      coerceType({})
    }, /could not determine a proper \"type\"/)
  })
})
