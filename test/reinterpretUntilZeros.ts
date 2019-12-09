import nodeRef, { CreateRefBuffer } from '../lib/index'
import { equal, strict as assert } from 'assert'
import { readFileSync } from 'fs'
// import weak from 'weak'

describe('reinterpretUntilZeros()', function() {
  // beforeEach(gc)

  it('should return a new Buffer instance up until the first 0', function() {
    const buf = CreateRefBuffer(Buffer.from('hello\0world'))
    const buf2 = buf.reinterpretUntilZeros(1)
    equal(buf2.length, 'hello'.length)
    equal(buf2.toString(), 'hello')
  })

  it('should return a new Buffer instance up until the first 0 starting from offset', function() {
    const buf = CreateRefBuffer(Buffer.from('hello\0world'))
    const buf2 = buf.reinterpretUntilZeros(1, 3)
    equal(buf2.length, 'lo'.length)
    equal(buf2.toString(), 'lo')
  })

  it('should return a new Buffer instance up until the first 2-byte sequence of 0s', function() {
    const str = 'hello world'
    const buf = CreateRefBuffer(Buffer.alloc(50))
    const len = buf.write(str, 'ucs2')
    buf.writeInt16LE(0, len) // NULL terminate the string

    const buf2 = buf.reinterpretUntilZeros(2)
    equal(str.length, buf2.length / 2)
    equal(buf2.toString('ucs2'), str)
  })

  it('should return a large Buffer instance > 10,000 bytes with UTF16-LE char bytes', function() {
    const data = readFileSync(__dirname + '/utf16le.bin')
    const strBuf = nodeRef.reinterpretUntilZeros(data, 2)
    assert(strBuf.length > 10000)
    const str = strBuf.toString('ucs2')
    // the data in `utf16le.bin` should be a JSON parsable string
    assert(JSON.parse(str))
  })
})
