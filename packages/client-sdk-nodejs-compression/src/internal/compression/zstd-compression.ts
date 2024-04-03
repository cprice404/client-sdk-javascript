// import {convert} from '@gomomento/sdk/dist/src/internal/utils';
// import {MomentoLoggerFactory, ValueCompression} from '@gomomento/sdk';
//
// export type ZstdModule = {
//   decompress(data: Buffer): Promise<Buffer>;
//   compress(data: Buffer, level?: number | undefined | null): Promise<Buffer>;
// };
//
// let loadedZstd: ZstdModule | undefined | null = null;
//
// export function loadZstdIfNotLoaded(
//   loggerFactory: MomentoLoggerFactory
// ): ZstdModule | undefined {
//   if (loadedZstd === null) {
//     const logger = loggerFactory.getLogger('momento-zstd');
//     logger.info('Attempting to load zstd library for compression.');
//     try {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,node/no-missing-require
//       loadedZstd = require('@mongodb-js/zstd');
//       logger.info(
//         'zstd library loaded successfully; compression features will be enabled.'
//       );
//     } catch (e) {
//       logger.info(
//         'unable to load zstd library; compression features will be disabled. to enable them, install the @mongodb-js/zstd package.'
//       );
//       loadedZstd = undefined;
//     }
//   }
//   return loadedZstd as ZstdModule | undefined;
// }
//
// export class ZstdCompressor {
//   private readonly logger;
//   constructor(
//     private readonly zstd: ZstdModule | undefined,
//     loggerFactory: MomentoLoggerFactory
//   ) {
//     this.zstd = zstd;
//     this.logger = loggerFactory.getLogger('momento-zstd');
//   }
//   async compress(
//     compression: ValueCompression,
//     value: Uint8Array
//   ): Promise<Uint8Array> {
//     let level;
//     switch (compression) {
//       case ValueCompression.Default:
//         level = 3;
//         break;
//       case ValueCompression.Fast:
//         level = 1;
//         break;
//       case ValueCompression.Smallest:
//         level = 9;
//         break;
//     }
//     if (this.zstd === undefined) {
//       this.logger.info(
//         'ZstdCompressor: zstd undefined, so skipping compression'
//       );
//       return Promise.resolve(convert(value));
//     } else {
//       const compressed = await this.zstd.compress(
//         Buffer.from(convert(value)),
//         level
//       );
//
//       this.logger.info(`Compressed value: ${compressed.toString()}`);
//
//       return compressed;
//     }
//   }
// }
//
// // export function zstdDefaultCompressor(
// //   zstd: ZstdModule | undefined
// // ): ZstdCompressor {
// //   return new ZstdCompressor(zstd, 3);
// // }
// //
// // export function zstdFastCompressor(
// //   zstd: ZstdModule | undefined
// // ): ZstdCompressor {
// //   return new ZstdCompressor(zstd, 1);
// // }
// //
// // export function zstdSmallestCompressor(
// //   zstd: ZstdModule | undefined
// // ): ZstdCompressor {
// //   return new ZstdCompressor(zstd, 9);
// // }
//
// export class ZstdDecompressor {
//   private readonly logger;
//   constructor(
//     private readonly zstd: ZstdModule | undefined,
//     loggerFactory: MomentoLoggerFactory
//   ) {
//     this.zstd = zstd;
//
//     this.logger = loggerFactory.getLogger('momento-zstd');
//   }
//   async decompressIfCompressed(value: Uint8Array): Promise<Uint8Array> {
//     if (this.zstd === undefined) {
//       return value;
//     } else {
//       this.logger.info('Attempting to decompress value');
//       // TODO: check bytes to see if it is compressed
//       // TODO: handle error
//       return await this.zstd.decompress(Buffer.from(value));
//     }
//   }
// }
//
// // export function zstdDecompressor(
// //   zstd: ZstdModule | undefined
// // ): ZstdDecompressor {
// //   return new ZstdDecompressor(zstd);
// // }

import {
  MomentoLogger,
  MomentoLoggerFactory,
  CompressionMode,
  Compression,
} from '@gomomento/sdk';
import * as zstd from '@mongodb-js/zstd';
import {convert} from '@gomomento/sdk/dist/src/internal/utils';

class ZtsdCompressor implements Compression {
  private readonly logger;
  constructor(logger: MomentoLogger) {
    this.logger = logger;
  }

  async compress(
    compression: CompressionMode,
    value: Uint8Array
  ): Promise<Uint8Array> {
    let level;
    switch (compression) {
      case CompressionMode.Default:
        level = 3;
        break;
      case CompressionMode.Fast:
        level = 1;
        break;
      case CompressionMode.Smallest:
        level = 9;
        break;
    }
    const compressed = await zstd.compress(Buffer.from(convert(value)), level);

    this.logger.info(`Compressed value: ${compressed.toString()}`);

    return compressed;
  }

  async decompressIfCompressed(value: Uint8Array): Promise<Uint8Array> {
    this.logger.info('Attempting to decompress value');
    // TODO: check bytes to see if it is compressed
    // TODO: handle error
    return await zstd.decompress(Buffer.from(value));
  }
}

export function loadZstdCompression(
  loggerFactory: MomentoLoggerFactory
): Compression {
  const logger = loggerFactory.getLogger('zstd-compression');
  logger.info('Zstd-compression module loading compressor');
  return new ZtsdCompressor(logger);
}

// class ZtsdDecompressor implements Decompressor {
//   private readonly logger;
//   constructor(logger: MomentoLogger) {
//     this.logger = logger;
//   }
//
//   async decompressIfCompressed(value: Uint8Array): Promise<Uint8Array> {
//     this.logger.info('Attempting to decompress value');
//     // TODO: check bytes to see if it is compressed
//     // TODO: handle error
//     return await zstd.decompress(Buffer.from(value));
//   }
// }

// export function loadDecompressor(
//   loggerFactory: MomentoLoggerFactory
// ): Decompressor {
//   const logger = loggerFactory.getLogger('zstd-compression');
//   logger.info('Zstd-compression module loading decompressor');
//   return new ZtsdDecompressor(logger);
// }
