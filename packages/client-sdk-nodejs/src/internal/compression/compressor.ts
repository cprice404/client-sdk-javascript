// import {MomentoLoggerFactory, ValueCompression} from '@gomomento/sdk-core';
// import {CompressionModule} from '../../compression-module';
//
// export interface Compressor {
//   compress(
//     compression: ValueCompression,
//     value: Uint8Array
//   ): Promise<Uint8Array>;
// }
//
// let loadedCompressor: Compressor | undefined | null = null;
//
// export function loadOrGetCompressor(
//   loggerFactory: MomentoLoggerFactory
// ): Compressor | undefined {
//   if (loadedCompressor === null) {
//     const logger = loggerFactory.getLogger('compressor');
//     logger.info('Attempting to load nodejs compression extensions.');
//     try {
//       // eslint-disable-next-line node/no-missing-require,@typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
//       const compressionModule: CompressionModule = require('@gomomento/sdk-nodejs-compression');
//       loadedCompressor = compressionModule.loadCompressor(loggerFactory);
//       logger.info(
//         'nodejs compression extensions loaded successfully; compression features will be enabled.'
//       );
//     } catch (e) {
//       logger.info(
//         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//         `unable to load nodejs compression extensions; compression features will be disabled. to enable them, install the @gomomento/sdk-nodejs-compression package: ${e}`
//       );
//       loadedCompressor = undefined;
//     }
//   }
//   return loadedCompressor;
// }
