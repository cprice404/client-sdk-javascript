import {ValueCompression} from '@gomomento/sdk-core';

export interface Compressor {
  compress(
    compression: ValueCompression,
    value: Uint8Array
  ): Promise<Uint8Array>;

  decompressIfCompressed(value: Uint8Array): Promise<Uint8Array>;
}

export interface CompressionProps {
  compressor?: Compressor;
  automaticDecompression: AutomaticDecompression;
}

export enum AutomaticDecompression {
  Enabled = 'Enabled',
  Disabled = 'Disabled',
}
