import { strict as assert } from 'assert'
import { endianness } from 'os'
import { inspect } from 'util'

interface INodeRef {
  sizeof: { [key in refBaseTypes]: number }
  alignof: { [key in refBaseTypes]: number }
  NULL: Buffer
  address: (buffer: Buffer, offset?: number) => number
  hexAddress: (buffer: Buffer, offset: number) => string
  isNull: (buffer: Buffer, offset?: number) => boolean
  readObject: (buffer: Buffer, offset?: number) => any
  writeObject: (buffer: Buffer, offset: number, obj: Object, persistent: boolean) => {}
  readPointer: (buffer: Buffer, offset: number, size: number) => Buffer
  writePointer: (buffer: Buffer, offset: number, ptr: Buffer) => {}
  readInt64: (buffer: Buffer, offset?: number) => Buffer
  writeInt64: (buffer: Buffer, offset: number, value: number) => {}
  readUInt64: (buffer: Buffer, offset?: number) => Buffer
  writeUInt64: (buffer: Buffer, offset: number, value: number) => {}
  readCString: (buffer: Buffer, offset?: number) => {}
  reinterpret: (buffer: Buffer, size: number, offset: number) => Buffer
  reinterpretUntilZeros: (buffer: Buffer, size: number, offset?: number) => Buffer
}
interface Type {
  /** The size in bytes required to hold this datatype. */
  size: number
  /** The current level of indirection of the buffer. */
  indirection: number
  /** To invoke when `ref.get` is invoked on a buffer of this type. */
  get(buffer: RefBuffer, offset: number): any
  /** To invoke when `ref.set` is invoked on a buffer of this type. */
  set(buffer: RefBuffer, offset: number, value: any): void
  /** The name to use during debugging for this datatype. */
  name?: string
  /** The alignment of this datatype when placed inside a struct. */
  alignment?: number
}
declare class RefBuffer extends Buffer {
  type?: Type
  _refs: Array<Object | Buffer>
  address(): number
  hexAddress(): string
  isNull(): boolean
  ref(): RefBuffer
  deref(): RefBuffer
  readObject(offset: number): any
  writeObject(obj: Object, offset: number): void
  readPointer(offset: number, size?: number): Buffer
  writePointer(ptr: Buffer, offset?: number): void
  readCString(offset?: number): string
  writeCString(string: string, offset?: number, encoding?: BufferEncoding): void
  readInt64BE(offset: number): number
  writeInt64BE(val: number, offset: number): void
  readUInt64BE(offset: number): number
  writeUInt64BE(val: number, offset: number): void
  readInt64LE(offset: number): number
  writeInt64LE(val: number, offset: number): void
  readUInt64LE(offset: number): number
  writeUInt64LE(val: number, offset: number): void
  reinterpret(size: number, offset?: number): Buffer
  reinterpretUntilZeros(size: number, offset?: number): Buffer
}
const nodeRef: INodeRef = require('bindings')('ref')

type TBaseTypes =
  | 'int8'
  | 'uint8'
  | 'int16'
  | 'uint16'
  | 'int32'
  | 'uint32'
  | 'int64'
  | 'uint64'
  | 'float'
  | 'double'
  | 'bool'
  | 'byte'
  | 'char'
  | 'uchar'
  | 'short'
  | 'ushort'
  | 'int'
  | 'uint'
  | 'long'
  | 'ulong'
  | 'longlong'
  | 'ulonglong'
  | 'size_t'
  | 'wchar_t'
  | 'Object'
type refBaseTypes = TBaseTypes | 'pointer'
type refTypes = TBaseTypes | 'void' | 'CString' | 'Utf8String'
type refTypesPointer =
  | 'int8 *'
  | 'uint8 *'
  | 'int16 *'
  | 'uint16 *'
  | 'int32 *'
  | 'uint32 *'
  | 'int64 *'
  | 'uint64 *'
  | 'float *'
  | 'double *'
  | 'bool *'
  | 'byte *'
  | 'char *'
  | 'uchar *'
  | 'short *'
  | 'ushort *'
  | 'int *'
  | 'uint *'
  | 'long *'
  | 'ulong *'
  | 'longlong *'
  | 'ulonglong *'
  | 'size_t *'
  | 'wchar_t *'
  | 'Object *'
  | 'void *'
  | 'CString *'
  | 'Utf8String *'
type refTypesPointer_Pointer =
  | 'int8 **'
  | 'uint8 **'
  | 'int16 **'
  | 'uint16 **'
  | 'int32 **'
  | 'uint32 **'
  | 'int64 **'
  | 'uint64 **'
  | 'float **'
  | 'double **'
  | 'bool **'
  | 'byte **'
  | 'char **'
  | 'uchar **'
  | 'short **'
  | 'ushort **'
  | 'int **'
  | 'uint **'
  | 'long **'
  | 'ulong **'
  | 'longlong **'
  | 'ulonglong **'
  | 'size_t **'
  | 'wchar_t **'
  | 'Object **'
  | 'void **'
  | 'CString **'
  | 'Utf8String **'
type createTypes = 'byte' | 'char' | 'uchar' | 'short' | 'ushort' | 'int' | 'uint' | 'long' | 'ulong' | 'longlong' | 'ulonglong' | 'size_t' | 'wchar_t'
type baseCreateTypes = 'void' | 'bool' | 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'int64' | 'uint64' | 'float' | 'double' | 'Object' | 'CString' | 'Utf8String'

export const CreateRefBuffer = (buffer: Buffer, type?: Type): RefBuffer => {
  const RefBuffer = {
    _refs: [],
    type,
    address() {
      return nodeRef.address(buffer, 0)
    },
    hexAddress() {
      return nodeRef.hexAddress(buffer, 0)
    },
    isNull() {
      return nodeRef.isNull(buffer, 0)
    },
    ref() {
      return ref(<RefBuffer>(<unknown>Object.assign(buffer, RefBuffer)))
    },
    deref() {
      return deref(<RefBuffer>(<unknown>Object.assign(buffer, RefBuffer)))
    },
    readObject(offset: number) {
      return nodeRef.readObject(buffer, offset)
    },
    writeObject(obj: Object, offset: number) {
      return writeObject(<RefBuffer>(<unknown>Object.assign(buffer, RefBuffer)), offset, obj, false)
    },
    readPointer(offset: number, size: number) {
      return nodeRef.readPointer(buffer, offset, size)
    },
    writePointer(ptr: Buffer, offset: number) {
      return writePointer(<RefBuffer>(<unknown>Object.assign(buffer, RefBuffer)), offset, ptr)
    },
    readCString(offset?: number) {
      return nodeRef.readCString(buffer, offset)
    },
    writeCString(string: string, offset: number, encoding: BufferEncoding) {
      return writeCString(buffer, offset, string, encoding)
    },
    readInt64BE(offset: number) {
      return readInt64BE(buffer, offset)
    },
    writeInt64BE(val: number, offset: number) {
      return writeInt64BE(buffer, offset, val)
    },
    readUInt64BE(offset: number) {
      return readUInt64BE(buffer, offset)
    },
    writeUInt64BE(val: number, offset: number) {
      return writeUInt64BE(buffer, offset, val)
    },
    readInt64LE(offset: number) {
      return readInt64LE(buffer, offset)
    },
    writeInt64LE(val: number, offset: number) {
      return writeInt64LE(buffer, offset, val)
    },
    readUInt64LE(offset: number) {
      return readUInt64LE(buffer, offset)
    },
    writeUInt64LE(val: number, offset: number) {
      return writeUInt64LE(buffer, offset, val)
    },
    reinterpret(size: number, offset: number) {
      return reinterpret(buffer, size, offset)
    },
    reinterpretUntilZeros(size: number, offset: number) {
      return reinterpretUntilZeros(buffer, size, offset)
    },
  }
  return <RefBuffer>(<unknown>Object.assign(buffer, RefBuffer))
}
const inspectSym = inspect.custom || 'inspect'

const overwriteInspect = (inspect: Function) => {
  if (inspect.name === 'refinspect') {
    return inspect
  } else {
    return function refinspect(this: any) {
      const v = inspect.apply(this, arguments)
      return v.replace('Buffer', 'Buffer@0x' + this.hexAddress())
    }
  }
}
// @ts-ignore
if (Buffer.prototype[inspectSym]) {
  // @ts-ignore
  Buffer.prototype[inspectSym] = overwriteInspect(Buffer.prototype[inspectSym])
}
/*export class RefBuffer extends Buffer {
  type: Type
  _refs: Array<Object | Buffer> = []
  constructor(size: number, type: Type) {
    super(size)
    this.type = type
    Object.setPrototypeOf(Buffer, this)
  }
  address() {
    return nodeRef.address(this, 0)
  }
  hexAddress() {
    return nodeRef.hexAddress(this, 0)
  }
  isNull() {
    return nodeRef.isNull(this, 0)
  }
  ref() {
    return ref(this)
  }
  deref() {
    return deref(this)
  }
  readObject(offset: number) {
    return nodeRef.readObject(this, offset)
  }
  writeObject(obj: Object, offset: number) {
    return writeObject(this, offset, obj, false)
  }
  readPointer(offset: number, size: number) {
    return nodeRef.readPointer(this, offset, size)
  }
  writePointer(ptr: Buffer, offset: number) {
    return writePointer(this, offset, ptr)
  }
  readCString(offset?: number) {
    return nodeRef.readCString(this, offset)
  }
  writeCString(string: string, offset: number, encoding: BufferEncoding) {
    return writeCString(this, offset, string, encoding)
  }
  readInt64BE(offset: number) {
    return readInt64BE(this, offset)
  }
  writeInt64BE(val: number, offset: number) {
    return writeInt64BE(this, offset, val)
  }
  readUInt64BE(offset: number) {
    return readUInt64BE(this, offset)
  }
  writeUInt64BE(val: number, offset: number) {
    return writeUInt64BE(this, offset, val)
  }
  readInt64LE(offset: number) {
    return readInt64LE(this, offset)
  }
  writeInt64LE(val: number, offset: number) {
    return writeInt64LE(this, offset, val)
  }
  readUInt64LE(offset: number) {
    return readUInt64LE(this, offset)
  }
  writeUInt64LE(val: number, offset: number) {
    return writeUInt64LE(this, offset, val)
  }
  reinterpret(size: number, offset: number) {
    return reinterpret(this, size, offset)
  }
  reinterpretUntilZeros(size: number, offset: number) {
    return reinterpretUntilZeros(this, size, offset)
  }
}*/

/*;['bool', 'byte', 'char', 'uchar', 'short', 'ushort', 'int', 'uint', 'long', 'ulong', 'longlong', 'ulonglong', 'size_t', 'wchar_t'].forEach((name: refBaseTypes) => {
  const unsigned = name === 'bool' || name === 'byte' || name === 'size_t' || name[0] === 'u'
  const size = nodeRef.sizeof[name]
  assert(size >= 1 && size <= 8)
  let typeName: refTypes = ('int' + size * 8) as refTypes
  if (unsigned) {
    typeName = ('u' + typeName) as refTypes
  }
  const type = types[typeName]
  assert(type)
  types[name] = Object.create(type)
})*/
const CreateType = (name: createTypes): Type => {
  const unsigned = name === 'byte' || name === 'size_t' || name[0] === 'u'
  const size = nodeRef.sizeof[name]
  assert(size >= 1 && size <= 8)
  let typeName: refTypes = ('int' + size * 8) as baseCreateTypes
  if (unsigned) {
    typeName = ('u' + typeName) as baseCreateTypes
  }
  const type = BaseTypes[typeName]
  // type.name = name
  assert(type)
  return Object.assign({}, type, { name })
}

const BaseTypes: { [key in baseCreateTypes]: Type } = {
  void: {
    name: 'void',
    size: 0,
    indirection: 1,
    get: (buf: RefBuffer, offset: number) => {
      return null
    },
    set: (buf: RefBuffer, offset: number, val: void) => {},
  },
  bool: {
    name: 'bool',
    size: nodeRef.sizeof.bool,
    indirection: 1,
    alignment: nodeRef.alignof.bool,
    get: (buf: RefBuffer, offset: number) => {
      return !!types.int8.get(buf, offset)
    },
    set: (buf: RefBuffer, offset: number, val: number | any) => {
      if (typeof val !== 'number') {
        val = val ? 1 : 0
      }
      return types.int8.set(buf, offset, val)
    },
  },
  /**
   * The `int8` type.
   */
  int8: {
    name: 'int8',
    size: nodeRef.sizeof.int8,
    indirection: 1,
    alignment: nodeRef.alignof.int8,
    get: (buf: RefBuffer, offset: number) => {
      return buf.readInt8(offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number | string) => {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeInt8(val, offset || 0)
    },
  },
  /**
   * The `uint8` type.
   */
  uint8: {
    name: 'uint8',
    size: nodeRef.sizeof.uint8,
    indirection: 1,
    alignment: nodeRef.alignof.uint8,
    get: (buf: RefBuffer, offset: number) => {
      return buf.readUInt8(offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number | string) => {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeUInt8(val, offset || 0)
    },
  },
  /**
   * The `int16` type.
   */
  int16: {
    name: 'int16',
    size: nodeRef.sizeof.int16,
    indirection: 1,
    alignment: nodeRef.alignof.int16,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readInt16${endianness()}` as 'readInt16LE' | 'readInt16BE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeInt16${endianness()}` as 'writeInt16LE' | 'writeInt16BE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `uint16` type.
   */
  uint16: {
    name: 'uint16',
    size: nodeRef.sizeof.uint16,
    indirection: 1,
    alignment: nodeRef.alignof.uint16,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readUInt16${endianness()}` as 'readUInt16LE' | 'readUInt16BE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeUInt16${endianness()}` as 'writeUInt16LE' | 'writeUInt16BE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `int32` type.
   */
  int32: {
    name: 'int32',
    size: nodeRef.sizeof.int32,
    indirection: 1,
    alignment: nodeRef.alignof.int32,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readInt32${endianness()}` as 'readInt32BE' | 'readInt32LE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeInt32${endianness()}` as 'writeInt32BE' | 'writeInt32LE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `uint32` type.
   */
  uint32: {
    name: 'uint32',
    size: nodeRef.sizeof.uint32,
    indirection: 1,
    alignment: nodeRef.alignof.uint32,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readUInt32${endianness()}` as 'readUInt32BE' | 'readUInt32LE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeUInt32${endianness()}` as 'writeUInt32BE' | 'writeUInt32LE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `int64` type.
   */
  int64: {
    name: 'int64',
    size: nodeRef.sizeof.int64,
    indirection: 1,
    alignment: nodeRef.alignof.int64,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readInt64${endianness()}` as 'readInt64BE' | 'readInt64LE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeInt64${endianness()}` as 'writeInt64BE' | 'writeInt64LE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `uint64` type.
   */
  uint64: {
    name: 'uint64',
    size: nodeRef.sizeof.uint64,
    indirection: 1,
    alignment: nodeRef.alignof.uint64,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readUInt64${endianness()}` as 'readUInt64BE' | 'readUInt64LE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeUInt64${endianness()}` as 'writeUInt64BE' | 'writeUInt64LE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `float` type.
   */
  float: {
    name: 'float',
    size: nodeRef.sizeof.float,
    indirection: 1,
    alignment: nodeRef.alignof.float,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readFloat${endianness()}` as 'readFloatBE' | 'readFloatLE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeFloat${endianness()}` as 'writeFloatBE' | 'writeFloatLE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `double` type.
   */
  double: {
    name: 'double',
    size: nodeRef.sizeof.double,
    indirection: 1,
    alignment: nodeRef.alignof.double,
    get: (buf: RefBuffer, offset: number) => {
      const Method = `readDouble${endianness()}` as 'readDoubleBE' | 'readDoubleLE'
      return buf[Method](offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: number) => {
      const Method = `writeDouble${endianness()}` as 'writeDoubleBE' | 'writeDoubleLE'
      return buf[Method](val, offset || 0)
    },
  },
  /**
   * The `Object` type. This can be used to read/write regular JS Objects
   * into raw memory.
   */
  Object: {
    name: 'Object',
    size: nodeRef.sizeof.Object,
    indirection: 1,
    alignment: nodeRef.alignof.Object,
    get: (buf: RefBuffer, offset: number) => {
      return buf.readObject(offset || 0)
    },
    set: (buf: RefBuffer, offset: number, val: Object) => {
      return buf.writeObject(val, offset || 0)
    },
  },
  /**
   * The `CString` (a.k.a `"string"`) type.
   *
   * CStrings are a kind of weird thing. We say it's `sizeof(char *)`, and
   * `indirection` level of 1, which means that we have to return a Buffer that
   * is pointer sized, and points to a some utf8 string data, so we have to create
   * a 2nd "in-between" buffer.
   */
  CString: {
    name: 'CString',
    size: nodeRef.sizeof.pointer,
    alignment: nodeRef.alignof.pointer,
    indirection: 1,
    get: (buf: RefBuffer, offset: number) => {
      const _buf = nodeRef.readPointer(buf, offset, 0)
      if (nodeRef.isNull(_buf)) {
        return null
      }
      return nodeRef.readCString(_buf, 0)
    },
    set: (buf: RefBuffer, offset: number, val: string) => {
      let _buf
      if (Buffer.isBuffer(val)) {
        _buf = val
      } else {
        // assume string
        _buf = allocCString(val)
      }
      return writePointer(buf, offset, _buf)
    },
  },
  Utf8String: {
    name: 'Utf8String',
    size: nodeRef.sizeof.pointer,
    alignment: nodeRef.alignof.pointer,
    indirection: 1,
    get: (buf: RefBuffer, offset: number) => {
      if (!utfstringwarned) {
        utfstringwarned = true
        console.error('"Utf8String" type is deprecated, use "CString" instead')
      }
      return types.CString
    },
    set: (buf: Buffer, offset: number, val: string) => {},
  },
}

// alias Utf8String
let utfstringwarned = false
/** Default types. */
export const types: { [key in refTypes]: Type } = {
  ...BaseTypes,
  byte: CreateType('byte'),
  char: CreateType('char'),
  uchar: CreateType('uchar'),
  short: CreateType('short'),
  ushort: CreateType('ushort'),
  int: CreateType('int'),
  uint: CreateType('uint'),
  long: CreateType('long'),
  ulong: CreateType('ulong'),
  longlong: CreateType('longlong'),
  ulonglong: CreateType('ulonglong'),
  size_t: CreateType('size_t'),
  wchar_t: CreateType('wchar_t'),
}

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level incremented by **1**.
 *
 * Say you wanted to create a type representing a `void *`:
 *
 * ```
 * var voidPtrType = ref.refType(ref.types.void);
 * ```
 *
 * @param {Object|String} type The "type" object to create a reference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` incremented by 1.
 */
export const refType = (type: Type | refTypes) => {
  const _type = coerceType(type)
  const rtn = Object.create(_type)
  rtn.indirection++
  if (_type.name) {
    Object.defineProperty(rtn, 'name', {
      value: _type.name + '*',
      configurable: true,
      enumerable: true,
      writable: true,
    })
  }
  return rtn
}

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level decremented by 1.
 *
 * @param {Object|String} type The "type" object to create a dereference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` decremented by 1.
 */
export const derefType = (type: Type | refTypes) => {
  const _type = coerceType(type)
  if (_type.indirection === 1) {
    throw new Error("Cannot create deref'd type for type with indirection 1")
  }
  let rtn = Object.getPrototypeOf(_type)
  if (rtn.indirection !== _type.indirection - 1) {
    // slow case
    rtn = Object.create(_type)
    rtn.indirection--
  }
  return rtn
}

/**
 * Coerces a "type" object from a String or an actual "type" object. String values
 * are looked up from the `ref.types` Object. So:
 *
 *   * `"int"` gets coerced into `ref.types.int`.
 *   * `"int *"` gets translated into `ref.refType(ref.types.int)`
 *   * `ref.types.int` gets translated into `ref.types.int` (returns itself)
 *
 * Throws an Error if no valid "type" object could be determined. Most `ref`
 * functions use this function under the hood, so anywhere a "type" object is
 * expected, a String may be passed as well, including simply setting the
 * `buffer.type` property.
 *
 * ```
 * var type = ref.coerceType('int **');
 *
 * console.log(type.indirection);
 * 3
 * ```
 *
 * @param {Object|String} type The "type" Object or String to coerce.
 * @return {Object} A "type" object
 */
export const coerceType = (type: Type | refTypes | refTypesPointer | refTypesPointer_Pointer): Type => {
  if (typeof type === 'string') {
    if (types[type as refTypes]) return types[type as refTypes]
    else {
      // strip whitespace
      let typeStr = type.replace(/\s+/g, '').toLowerCase()
      if (typeStr === 'pointer') {
        // legacy "pointer" being used :(
        return refType(types.void) // void *
      } else if (typeStr === 'string') {
        return types.CString // special char * type
      } else {
        let refCount = 0
        typeStr = typeStr.replace(/\*/g, function() {
          refCount++
          return ''
        })
        // allow string names to be passed in
        let rtn = types[typeStr as refTypes]
        if (refCount > 0) {
          if (!(rtn && 'size' in rtn && 'indirection' in rtn)) {
            throw new TypeError('could not determine a proper "type" from: ' + JSON.stringify(type))
          }
          for (let i = 0; i < refCount; i++) {
            rtn = refType(rtn)
          }
        }
        return rtn
      }
    }
  } else {
    if (!('size' in type && 'indirection' in type)) {
      throw new TypeError('could not determine a proper "type" from: ' + JSON.stringify(type))
    }
    return type
  }
}

/**
 * Returns the "type" property of the given Buffer.
 * Creates a default type for the buffer when none exists.
 *
 * @param {Buffer} buffer The Buffer instance to get the "type" object from.
 * @return {Object} The "type" object from the given Buffer.
 */

export const getType = (buffer: RefBuffer) => {
  if (!buffer.type) {
    console.debug('WARN: no "type" found on buffer, setting default "type"', buffer)
    buffer.type = {
      size: buffer.length,
      indirection: 1,
      get: () => {
        throw new Error('unknown "type"; cannot get()')
      },
      set: () => {
        throw new Error('unknown "type"; cannot set()')
      },
    }
  }
  return coerceType(buffer.type)
}

/**
 * Calls the `get()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level and returning a
 * proper "dereferenced" Bufffer instance when necessary.
 *
 * @param {Buffer} buffer The Buffer instance to read from.
 * @param {Number} offset (optional) The offset on the Buffer to start reading from. Defaults to 0.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 * @return {?} Whatever value the "type" used when reading returns.
 */

export const get = (buffer: RefBuffer, offset?: number, type?: Type | refTypes) => {
  if (!offset) {
    offset = 0
  }
  if (type) {
    type = coerceType(type)
  } else {
    type = getType(buffer)
  }
  console.debug('get(): (offset: %d)', offset, buffer)
  assert(type.indirection > 0, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    // need to check "type"
    return type.get(buffer, offset)
  } else {
    // need to create a deref'd Buffer
    const size = type.indirection === 2 ? type.size : nodeRef.sizeof.pointer
    return CreateRefBuffer(nodeRef.readPointer(buffer, offset, size), derefType(type))
  }
}

/**
 * Calls the `set()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level writing a pointer rather
 * than calling the `set()` function if the indirection is greater than 1.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset on the Buffer to start writing to.
 * @param {?} value The value to write to the Buffer instance.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 */

export const set = (buffer: RefBuffer, offset: number, value: any, type?: Type | refTypes) => {
  if (type) {
    type = coerceType(type)
  } else {
    type = getType(buffer)
  }
  console.debug('set(): (offset: %d)', offset, buffer, value)
  assert(type.indirection >= 1, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    type.set(buffer, offset, value)
  } else {
    writePointer(buffer, offset, value)
  }
}

/**
 * Returns a new Buffer instance big enough to hold `type`,
 * with the given `value` written to it.
 *
 * ``` js
 * var intBuf = ref.alloc(ref.types.int)
 * var int_with_4 = ref.alloc(ref.types.int, 4)
 * ```
 *
 * @param {Object|String} _type The "type" object to allocate. Strings get coerced first.
 * @param {?} value (optional) The initial value set on the returned Buffer, using _type_'s `set()` function.
 * @return {Buffer} A new Buffer instance with it's `type` set to "type", and (optionally) "value" written to it.
 */

export const alloc = (_type: Type | refTypes, value?: any): RefBuffer => {
  const type = coerceType(_type)
  console.debug('allocating Buffer for type with "size"', type.size)
  let size
  if (type.indirection === 1) {
    size = type.size
  } else {
    size = nodeRef.sizeof.pointer
  }
  const buffer = CreateRefBuffer(Buffer.alloc(size), type)
  if (value) {
    console.debug('setting value on allocated buffer', value)
    set(buffer, 0, value, type)
  }
  return buffer
}
const charPtrType = refType(types.char)
/**
 * Returns a new `Buffer` instance with the given String written to it with the
 * given encoding (defaults to __'utf8'__). The buffer is 1 byte longer than the
 * string itself, and is NUL terminated.
 *
 * ```
 * var buf = ref.allocCString('hello world');
 *
 * console.log(buf.toString());
 * 'hello world\u0000'
 * ```
 *
 * @param {String} string The JavaScript string to be converted to a C string.
 * @param {String} encoding (optional) The encoding to use for the C string. Defaults to __'utf8'__.
 * @return {Buffer} The new `Buffer` instance with the specified String wrtten to it, and a trailing NUL byte.
 */
export const allocCString = (string: string | null | undefined | Buffer, encoding?: BufferEncoding): RefBuffer => {
  if (null == string || (Buffer.isBuffer(string) && nodeRef.isNull(string))) {
    return CreateRefBuffer(nodeRef.NULL)
  }
  const size = Buffer.byteLength(string, encoding) + 1
  const buffer = CreateRefBuffer(Buffer.alloc(size), charPtrType)
  writeCString(buffer, 0, string.toString(), encoding)
  return buffer
}

/**
 * Writes the given string as a C String (NULL terminated) to the given buffer
 * at the given offset. "encoding" is optional and defaults to __'utf8'__.
 *
 * Unlike `readCString()`, this function requires the buffer to actually have the
 * proper length.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset of the buffer to begin writing at.
 * @param {String} string The JavaScript String to write that will be written to the buffer.
 * @param {String} encoding (optional) The encoding to read the C string as. Defaults to __'utf8'__.
 */

export const writeCString = (buffer: Buffer, offset: number, string: string, encoding?: BufferEncoding) => {
  assert(Buffer.isBuffer(buffer), 'expected a Buffer as the first argument')
  assert.equal('string', typeof string, 'expected a "string" as the third argument')
  if (!offset) {
    offset = 0
  }
  if (!encoding) {
    encoding = 'utf8'
  }
  const size = buffer.length - offset
  const len = buffer.write(string, offset, size, encoding)
  buffer.writeUInt8(0, offset + len) // NUL terminate
}

const int64temp = Buffer.alloc(nodeRef.sizeof.int64)
const uint64temp = Buffer.alloc(nodeRef.sizeof.uint64)

const readInt64 = (buffer: Buffer, offset: number) => {
  for (let i = 0; i < nodeRef.sizeof.int64; i++) {
    int64temp[i] = buffer[offset + nodeRef.sizeof.int64 - i - 1]
  }
  return nodeRef.readInt64(int64temp, 0)
}
export const readInt64BE = readInt64
export const readInt64LE = readInt64

const readUInt64 = (buffer: Buffer, offset: number) => {
  for (let i = 0; i < nodeRef.sizeof.uint64; i++) {
    uint64temp[i] = buffer[offset + nodeRef.sizeof.uint64 - i - 1]
  }
  return nodeRef.readUInt64(uint64temp, 0)
}
export const readUInt64BE = readUInt64
export const readUInt64LE = readUInt64

const writeInt64 = (buffer: Buffer, offset: number, value: number) => {
  nodeRef.writeInt64(int64temp, 0, value)
  for (let i = 0; i < nodeRef.sizeof.int64; i++) {
    buffer[offset + i] = int64temp[nodeRef.sizeof.int64 - i - 1]
  }
}
export const writeInt64BE = writeInt64
export const writeInt64LE = writeInt64

const writeUInt64 = (buffer: Buffer, offset: number, value: number) => {
  nodeRef.writeUInt64(uint64temp, 0, value)
  for (let i = 0; i < nodeRef.sizeof.uint64; i++) {
    buffer[offset + i] = uint64temp[nodeRef.sizeof.uint64 - i - 1]
  }
}
export const writeUInt64BE = writeUInt64
export const writeUInt64LE = writeUInt64

/**
 * `ref()` accepts a Buffer instance and returns a new Buffer
 * instance that is "pointer" sized and has its data pointing to the given
 * Buffer instance. Essentially the created Buffer is a "reference" to the
 * original pointer, equivalent to the following C code:
 *
 * ``` c
 * char *buf = buffer;
 * char **ref = &buf;
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to create a reference to.
 * @return {Buffer} A new Buffer instance pointing to _buffer_.
 */
export const ref = (buffer: RefBuffer) => {
  console.debug('creating a reference to buffer', buffer)
  const type = refType(getType(buffer))
  return alloc(type, buffer)
}

/**
 * Accepts a Buffer instance and attempts to "dereference" it.
 * That is, first it checks the `indirection` count of _buffer_'s "type", and if
 * it's greater than __1__ then it merely returns another Buffer, but with one
 * level less `indirection`.
 *
 * When _buffer_'s indirection is at __1__, then it checks for `buffer.type`
 * which should be an Object with its own `get()` function.
 *
 * ```
 * var buf = ref.alloc('int', 6);
 *
 * var val = ref.deref(buf);
 * console.log(val);
 * 6
 * ```
 *
 *
 * @param {Buffer} buffer A Buffer instance to dereference.
 * @return {?} The returned value after dereferencing _buffer_.
 */
export const deref = (buffer: RefBuffer) => {
  console.debug('dereferencing buffer', buffer)
  return get(buffer)
}

/**
 * Attaches _object_ to _buffer_ such that it prevents _object_ from being garbage
 * collected until _buffer_ does.
 *
 * @param {Buffer} buffer A Buffer instance to attach _object_ to.
 * @param {Object|Buffer} object An Object or Buffer to prevent from being garbage collected until _buffer_ does.
 * @api private
 */
export const _attach = (buffer: RefBuffer, object: Object | Buffer) => {
  if (!buffer._refs) {
    buffer._refs = []
  }
  buffer._refs.push(object)
}

/**
 * Same as `ref.writeObject()`, except that this version does not _attach_ the
 * Object to the Buffer, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} object The Object to be written into _buffer_.
 * @api private
 */
export const _writeObject = nodeRef.writeObject
/**
 * Writes a pointer to _object_ into _buffer_ at the specified _offset.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var buf = ref.alloc('Object');
 * ref.writeObject(buf, 0, { foo: 'bar' });
 *
 * ```
 *
 * @param {Buffer} buf A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} obj The Object to be written into _buffer_.
 * @param persistent
 */
export const writeObject = (buf: RefBuffer, offset: number, obj: Object, persistent: boolean) => {
  console.debug('writing Object to buffer', buf, offset, obj, persistent)
  _writeObject(buf, offset, obj, persistent)
  _attach(buf, obj)
}

/**
 * Same as `ref.writePointer()`, except that this version does not attach
 * _pointer_ to _buffer_, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} pointer The Buffer instance whose memory address will be written to _buffer_.
 * @api private
 */
export const _writePointer = nodeRef.writePointer
/**
 * Writes the memory address of _pointer_ to _buffer_ at the specified _offset_.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var someBuffer = new Buffer('whatever');
 * var buf = ref.alloc('pointer');
 * ref.writePointer(buf, 0, someBuffer);
 * ```
 *
 * @param {Buffer} buf A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} ptr The Buffer instance whose memory address will be written to _buffer_.
 */
export const writePointer = (buf: RefBuffer, offset: number, ptr: Buffer) => {
  console.debug('writing pointer to buffer', buf, offset, ptr)
  _writePointer(buf, offset, ptr)
  _attach(buf, ptr)
}

/**
 * Same as `ref.reinterpret()`, except that this version does not attach
 * _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 * @api private
 */
export const _reinterpret = nodeRef.reinterpret

/**
 * Returns a new Buffer instance with the specified _size_, with the same memory
 * address as _buffer_.
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 */
export const reinterpret = (buffer: Buffer, size: number, offset: number): Buffer => {
  console.debug('reinterpreting buffer to "%d" bytes', size)
  const rtn = CreateRefBuffer(_reinterpret(buffer, size, offset || 0), coerceType('void'))
  _attach(rtn, buffer)
  return rtn
}

/**
 * Same as `ref.reinterpretUntilZeros()`, except that this version does not
 * attach _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes that are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 * @api private
 */
export const _reinterpretUntilZeros = nodeRef.reinterpretUntilZeros
/**
 * Accepts a `Buffer` instance and a number of `NULL` bytes to read from the
 * pointer. This function will scan past the boundary of the Buffer's `length`
 * until it finds `size` number of aligned `NULL` bytes.
 *
 * This is useful for finding the end of NUL-termintated array or C string. For
 * example, the `readCString()` function _could_ be implemented like:
 *
 * ```
 * function readCString (buf) {
 *   return ref.reinterpretUntilZeros(buf, 1).toString('utf8')
 * }
 * ```
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 */
export const reinterpretUntilZeros = (buffer: Buffer, size: number, offset: number): Buffer => {
  console.debug('reinterpreting buffer to until "%d" NULL (0) bytes are found', size)
  const rtn = CreateRefBuffer(_reinterpretUntilZeros(buffer, size, offset || 0), coerceType('void'))
  _attach(rtn, buffer)
  return rtn
}

export const NULL_POINTER = ref(CreateRefBuffer(nodeRef.NULL, coerceType('void')))

export default nodeRef
