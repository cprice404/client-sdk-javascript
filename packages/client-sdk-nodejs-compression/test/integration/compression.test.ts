// import {credsProvider} from './integration-setup';
// import {CacheClientPropsWithConfig} from '../../src/internal/cache-client-props-with-config';
// import {
//   CacheClient,
//   Configurations,
//   DefaultMomentoLoggerFactory,
//   DefaultMomentoLoggerLevel,
//   MiddlewareFactory,
// } from '../../src';
//

import {expectWithMessage} from './integration-setup';

// const {cacheClientPropsWithConfig, cacheName} = setupIntegrationTest();

describe('CompressionExtensions', () => {
  it('should compress the value if CompressionMode is specified', () => {
    expectWithMessage(() => {
      expect(true).toEqual(false);
    }, 'EXPECTED TRUE TO EQUAL FALSE');
  });
});
//     const value = 'a'.repeat(5_000_000);
//     const key = '5mb';
//
//     const setResponse = await cacheClient.set(
//       integrationTestCacheName,
//       key,
//       value
//     );
//     expectWithMessage(() => {
//       expect(setResponse).toBeInstanceOf(CacheSet.Success);
//     }, `expected to successfully set 5mb string for key ${key}, received ${setResponse.toString()}`);
//
//     const getResponse = await cacheClient.get(integrationTestCacheName, '5mb');
//     expectWithMessage(() => {
//       expect(getResponse).toBeInstanceOf(CacheGet.Hit);
//     }, `expected to successfully get 5mb string for key ${key}, received ${getResponse.toString()}`);
//
//     const responseValue = (getResponse as CacheGet.Hit).value();
//     expectWithMessage(() => {
//       expect(responseValue).toEqual(value);
//     }, `expected 5mb retrieved string to match 5mb value that was set for key ${key}`);
//   });
// });

// describe("Test exercises closing a client and jest doesn't hang", () => {
//   it('constructs a client with background task and closes it', async () => {
//     let client;
//     try {
//       client = await CacheClient.create(
//         integrationTestCacheClientPropsWithExperimentalMetricsMiddleware()
//       );
//     } finally {
//       if (client) client.close();
//     }
//   });
// });
//
// function integrationTestCacheClientPropsWithExperimentalMetricsMiddleware(): CacheClientPropsWithConfig {
//   const loggerFactory = new DefaultMomentoLoggerFactory(
//     DefaultMomentoLoggerLevel.INFO
//   );
//   return {
//     configuration: Configurations.Laptop.latest(loggerFactory)
//       .withClientTimeoutMillis(90000)
//       .withMiddlewares(
//         MiddlewareFactory.createMetricsMiddlewares(loggerFactory, {
//           eventLoopMetricsLog: true,
//           garbageCollectionMetricsLog: true,
//           activeRequestCountMetricsLog: true,
//         })
//       ),
//     credentialProvider: credsProvider(),
//     defaultTtlSeconds: 1111,
//   };
// }
