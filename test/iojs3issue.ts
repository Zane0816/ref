import { coerceType, CreateRefBuffer, deref, ref } from '../lib'
import assert from 'assert'

// This will check if the new Buffer implementation behaves like the pre io.js 3.0 one did:
describe('iojs3issue', function() {
  it('should not crash', function() {
    for (let i = 0; i < 10; i++) {
      // gc()
      const buf = Buffer.alloc(8)
      buf.fill(0)
      const buf2 = ref(CreateRefBuffer(buf, coerceType('void')))
      const buf3 = deref(buf2)
    }
  })
  it('should not crash too', function() {
    for (let i = 0; i < 10; i++) {
      // gc()
      const buf = Buffer.alloc(7)
      buf.fill(0)
      const buf2 = ref(CreateRefBuffer(buf, coerceType('void')))
      const buf3 = deref(buf2)
    }
  })
})
