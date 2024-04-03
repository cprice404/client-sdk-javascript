// export interface ValueCompressor {
//   compress(value: string | Uint8Array): Promise<Uint8Array>;
// }
//
// export interface ValueDecompressor {
//   decompressIfCompressed(value: Uint8Array): Promise<Uint8Array>;
// }

export enum CompressionMode {
  Default = 'Default',
  Fast = 'Fast',
  Smallest = 'Smallest',
}
