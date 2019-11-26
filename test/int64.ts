import ref, { readInt64BE, readInt64LE, readUInt64BE, readUInt64LE, writeInt64BE, writeInt64LE, writeUInt64BE, writeUInt64LE } from '../lib/ref-ts'
import { equal, throws, strict as assert } from 'assert'

describe('int64', function() {
  const JS_MAX_INT = +9007199254740992
  const JS_MIN_INT = -9007199254740992

  it('should allow simple ints to be written and read', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const val = 123456789
    ref.writeInt64(buf, 0, val)
    const rtn = ref.readInt64(buf, 0)
    equal(val, rtn)
  })

  it('should allow INT64_MAX to be written and read', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const val = '9223372036854775807'
    // @ts-ignore
    ref.writeInt64(buf, 0, val)
    const rtn = ref.readInt64(buf, 0)
    equal(val, rtn)
  })

  it('should allow a hex String to be input (signed)', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const val = '-0x1234567890'
    // @ts-ignore
    ref.writeInt64(buf, 0, val)
    const rtn = ref.readInt64(buf, 0)
    equal(parseInt(val, 16), rtn)
  })

  it('should allow an octal String to be input (signed)', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const val = '-0777'
    // @ts-ignore
    ref.writeInt64(buf, 0, val)
    const rtn = ref.readInt64(buf, 0)
    equal(parseInt(val, 8), rtn)
  })

  it('should allow a hex String to be input (unsigned)', function() {
    const buf = new Buffer(ref.sizeof.uint64)
    const val = '0x1234567890'
    // @ts-ignore
    ref.writeUInt64(buf, 0, val)
    const rtn = ref.readUInt64(buf, 0)
    equal(parseInt(val, 16), rtn)
  })

  it('should allow an octal String to be input (unsigned)', function() {
    const buf = new Buffer(ref.sizeof.uint64)
    const val = '0777'
    // @ts-ignore
    ref.writeUInt64(buf, 0, val)
    const rtn = ref.readUInt64(buf, 0)
    equal(parseInt(val, 8), rtn)
  })

  it('should return a Number when reading JS_MIN_INT', function() {
    const buf = new Buffer(ref.sizeof.int64)
    ref.writeInt64(buf, 0, JS_MIN_INT)
    const rtn = ref.readInt64(buf, 0)
    equal('number', typeof rtn)
    equal(JS_MIN_INT, rtn)
  })

  it('should return a Number when reading JS_MAX_INT', function() {
    const buf = new Buffer(ref.sizeof.int64)
    ref.writeInt64(buf, 0, JS_MAX_INT)
    const rtn = ref.readInt64(buf, 0)
    equal('number', typeof rtn)
    equal(JS_MAX_INT, rtn)
  })

  it('should return a String when reading JS_MAX_INT+1', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const plus_one = '9007199254740993'
    // @ts-ignore
    ref.writeInt64(buf, 0, plus_one)
    const rtn = ref.readInt64(buf, 0)
    equal('string', typeof rtn)
    equal(plus_one, rtn)
  })

  it('should return a String when reading JS_MIN_INT-1', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const minus_one = '-9007199254740993'
    // @ts-ignore
    ref.writeInt64(buf, 0, minus_one)
    const rtn = ref.readInt64(buf, 0)
    equal('string', typeof rtn)
    equal(minus_one, rtn)
  })

  it('should return a Number when reading 0, even when written as a String', function() {
    const buf = new Buffer(ref.sizeof.int64)
    const zero = '0'
    // @ts-ignore
    ref.writeInt64(buf, 0, zero)
    const rtn = ref.readInt64(buf, 0)
    equal('number', typeof rtn)
    equal(0, rtn)
  })

  it('should throw a "no digits" Error when writing an invalid String (signed)', function() {
    throws(function() {
      const buf = new Buffer(ref.sizeof.int64)
      // @ts-ignore
      ref.writeInt64(buf, 0, 'foo')
    }, /no digits we found in input String/)
  })

  it('should throw a "no digits" Error when writing an invalid String (unsigned)', function() {
    throws(function() {
      const buf = new Buffer(ref.sizeof.uint64)
      // @ts-ignore
      ref.writeUInt64(buf, 0, 'foo')
    }, /no digits we found in input String/)
  })

  it('should throw an "out of range" Error when writing an invalid String (signed)', function() {
    let e
    try {
      const buf = new Buffer(ref.sizeof.int64)
      // @ts-ignore
      ref.writeInt64(buf, 0, '10000000000000000000000000')
    } catch (_e) {
      e = _e
    }
    assert(/input String numerical value out of range/.test(e.message))
  })

  it('should throw an "out of range" Error when writing an invalid String (unsigned)', function() {
    let e
    try {
      const buf = new Buffer(ref.sizeof.uint64)
      // @ts-ignore
      ref.writeUInt64(buf, 0, '10000000000000000000000000')
    } catch (_e) {
      e = _e
    }
    assert(/input String numerical value out of range/.test(e.message))
  })

  it('should throw an Error when reading an int64_t from the NULL pointer', function() {
    throws(function() {
      ref.readInt64(ref.NULL)
    })
  })

  it('should throw an Error when reading an uint64_t from the NULL pointer', function() {
    throws(function() {
      ref.readUInt64(ref.NULL)
    })
  })
  ;['LE', 'BE'].forEach(function(endianness) {
    describe(endianness, function() {
      it('should read and write a signed ' + endianness + ' 64-bit integer', function() {
        const val = -123456789
        const buf = new Buffer(ref.sizeof.int64)
        if (endianness === 'BE') {
          writeInt64BE(buf, 0, val)
          equal(val, readInt64BE(buf, 0))
        } else {
          writeInt64LE(buf, 0, val)
          equal(val, readInt64LE(buf, 0))
        }
        // ref['writeInt64' + endianness](buf, 0, val)
        // // @ts-ignore
        // equal(val, ref['readInt64' + endianness](buf, 0))
      })

      it('should read and write an unsigned ' + endianness + ' 64-bit integer', function() {
        const val = 123456789
        const buf = new Buffer(ref.sizeof.uint64)
        if (endianness === 'BE') {
          writeUInt64BE(buf, 0, val)
          equal(val, readUInt64BE(buf, 0))
        } else {
          writeUInt64LE(buf, 0, val)
          equal(val, readUInt64LE(buf, 0))
        }
        // @ts-ignore
        // ref['writeUInt64' + endianness](buf, 0, val)
        // // @ts-ignore
        // equal(val, ref['readUInt64' + endianness](buf, 0))
      })
    })
  })
})
