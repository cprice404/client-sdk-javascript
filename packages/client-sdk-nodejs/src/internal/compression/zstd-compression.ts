import {
  ValueCompressor,
  ValueDecompressor,
} from '../../../../core/src/compression/value-compression';
import {convert} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const zstd: {
  decompress(data: Buffer): Promise<Buffer>;
  compress(data: Buffer, level?: number | undefined | null): Promise<Buffer>;
  // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require
} = require('@mongodb-js/zstd');
//
// const loadZstd = async () => {
//   try {
//     return await import('@mongodb-js/zstd');
//   } catch (e) {
//     return undefined;
//   }
// };
//
// const zstd = await loadZstd();

class ZstdCompressor implements ValueCompressor {
  constructor(private readonly level?: number) {
    this.level = level;
  }
  compress(value: string | Uint8Array): Promise<Uint8Array> {
    return zstd.compress(Buffer.from(convert(value)), this.level);
  }
}

export function zstdDefaultCompressor(): ValueCompressor {
  return new ZstdCompressor(3);
}

export function zstdFastCompressor(): ValueCompressor {
  return new ZstdCompressor(1);
}

export function zstdSmallestCompressor(): ValueCompressor {
  return new ZstdCompressor(9);
}

export function zstdDecompressor(): ValueDecompressor | undefined {
  return {
    async decompressIfCompressed(value: Uint8Array): Promise<Uint8Array> {
      try {
        return await zstd.decompress(Buffer.from(value));
      } catch (e) {
        return value;
      }
    },
  };
}
