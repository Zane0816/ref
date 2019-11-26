import { alloc } from '../lib/ref-ts'
import { strictEqual } from 'assert'

describe('char', function() {
  it("should accept a JS String, and write the first char's code", function() {
    const val = 'a'

    let buf = alloc('char', val)
    strictEqual(val.charCodeAt(0), buf.deref())

    buf = alloc('uchar', val)
    strictEqual(val.charCodeAt(0), buf.deref())
  })
})
