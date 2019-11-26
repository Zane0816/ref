import ref, { alloc, allocCString, CreateRefBuffer, get, NULL_POINTER, set, types } from '../lib/ref-ts'
import { equal, strictEqual, throws, strict as assert } from 'assert'

describe('C string', function() {
  describe('readCString()', function() {
    it('should return "" for a Buffer containing "\\0"', function() {
      const buf = CreateRefBuffer(Buffer.from('\0'))
      strictEqual('', buf.readCString(0))
    })

    it('should return "hello" for a Buffer containing "hello\\0world"', function() {
      const buf = CreateRefBuffer(Buffer.from('hello\0world'))
      strictEqual('hello', buf.readCString(0))
    })

    it('should throw an Error when reading from the NULL pointer', function() {
      throws(function() {
        // @ts-ignore
        ref.NULL.readCString()
      })
    })
  })

  describe('writeCString()', function() {
    it('should write a C string (NULL terminated) to a Buffer', function() {
      const buf = CreateRefBuffer(Buffer.alloc(20))
      const str = 'hello world'
      buf.writeCString(str)
      for (let i = 0; i < str.length; i++) {
        equal(str.charCodeAt(i), buf[i])
      }
      equal(0, buf[str.length])
    })
  })

  describe('allocCString()', function() {
    it('should return a new Buffer containing the given string', function() {
      const buf = allocCString('hello world')
      strictEqual('hello world', buf.readCString())
    })

    it('should return the NULL pointer for `null` values', function() {
      const buf = allocCString(null)
      assert(buf.isNull())
      strictEqual(0, buf.address())
    })

    it('should return the NULL pointer for `undefined` values', function() {
      const buf = allocCString(undefined)
      assert(buf.isNull())
      strictEqual(0, buf.address())
    })

    it('should return the NULL pointer for a NULL pointer Buffer', function() {
      const buf = allocCString(ref.NULL)
      assert(buf.isNull())
      strictEqual(0, buf.address())
    })
  })

  describe('CString', function() {
    it('should return JS `null` when given a pointer pointing to NULL', function() {
      const buf = alloc(types.CString)
      buf.writePointer(ref.NULL)
      strictEqual(null, buf.deref())

      // another version of the same test
      strictEqual(null, get(NULL_POINTER, 0, types.CString))
    })

    it('should read a utf8 string from a Buffer', function() {
      const str = 'hello world'
      const buf = alloc(types.CString)
      buf.writePointer(CreateRefBuffer(Buffer.from(str + '\0')))
      strictEqual(str, buf.deref())
    })

    // https://github.com/node-ffi/node-ffi/issues/169
    it('should set a Buffer as backing store', function() {
      const str = 'hey!'
      const store = CreateRefBuffer(Buffer.from(str + '\0'))
      const buf = alloc(types.CString)
      set(buf, 0, store)

      equal(str, get(buf, 0))
    })
  })
})
