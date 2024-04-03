// import {MomentoLoggerFactory} from '@gomomento/sdk-core';
// import {CompressionModule} from '../../compression-module';
//
// export interface Decompressor {
//   decompressIfCompressed(value: Uint8Array): Promise<Uint8Array>;
// }
// //
// // export class NoopDecompressor implements Decompressor {
// //   decompressIfCompressed(value: Uint8Array): Promise<Uint8Array> {
// //     return Promise.resolve(value);
// //   }
// // }
//
// let loadedDecompressor: Decompressor | undefined | null = null;
//
// export function loadOrGetDecompressor(
//   loggerFactory: MomentoLoggerFactory
// ): Decompressor | undefined {
//   if (loadedDecompressor === null) {
//     const logger = loggerFactory.getLogger('decompressor');
//     logger.info('Attempting to load nodejs decompression extensions.');
//     try {
//       // eslint-disable-next-line @typescript-eslint/no-var-requires,node/no-missing-require,@typescript-eslint/no-unsafe-assignment
//       const compressionModule: CompressionModule = require('@gomomento/sdk-nodejs-compression');
//       loadedDecompressor = compressionModule.loadDecompressor(loggerFactory);
//       logger.info(
//         'nodejs decompression extensions loaded successfully; compression features will be enabled.'
//       );
//     } catch (e) {
//       logger.info(
//         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//         `unable to load nodejs decompression extensions; compression features will be disabled. to enable them, install the @gomomento/sdk-nodejs-compression package: ${e}`
//       );
//       loadedDecompressor = undefined;
//     }
//   }
//   return loadedDecompressor;
// }
