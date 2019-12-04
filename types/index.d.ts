export default interface INodeRef {
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
export interface Type {
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

export declare class RefBuffer extends Buffer {
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
