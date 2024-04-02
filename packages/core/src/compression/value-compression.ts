// export interface ValueCompressor {
//   compress(value: string | Uint8Array): Promise<Uint8Array>;
// }
//
// export interface ValueDecompressor {
//   decompressIfCompressed(value: Uint8Array): Promise<Uint8Array>;
// }

export enum ValueCompression {
  Default = 'Default',
  Fast = 'Fast',
  Smallest = 'Smallest',
}
