// import {testCacheName} from '@gomomento/common-integration-tests';
// import {
//   AuthClient,
//   CreateCache,
//   Configurations,
//   DeleteCache,
//   MomentoErrorCode,
//   CacheClient,
//   CredentialProvider,
//   CollectionTtl,
//   TopicClient,
//   PreviewVectorIndexClient,
//   VectorIndexConfigurations,
//   PreviewLeaderboardClient,
//   LeaderboardConfigurations,
// } from '../../src';
// import {ICacheClient} from '@gomomento/sdk-core/dist/src/clients/ICacheClient';
// import {ITopicClient} from '@gomomento/sdk-core/dist/src/clients/ITopicClient';
// import {CacheClientPropsWithConfig} from '../../src/internal/cache-client-props-with-config';
// import {ReadConcern} from '@gomomento/sdk-core';
//
export const deleteCacheIfExists = async (
  momento: CacheClient,
  cacheName: string
) => {
  const deleteResponse = await momento.deleteCache(cacheName);
  if (deleteResponse instanceof DeleteCache.Error) {
    if (deleteResponse.errorCode() !== MomentoErrorCode.NOT_FOUND_ERROR) {
      throw deleteResponse.innerException();
    }
  }
};
//
// export async function WithCache(
//   client: CacheClient,
//   cacheName: string,
//   block: () => Promise<void>
// ) {
//   await deleteCacheIfExists(client, cacheName);
//   await client.createCache(cacheName);
//   try {
//     await block();
//   } finally {
//     await deleteCacheIfExists(client, cacheName);
//   }
// }
//
// let _credsProvider: CredentialProvider | undefined = undefined;
// export function credsProvider(): CredentialProvider {
//   if (_credsProvider === undefined) {
//     _credsProvider = CredentialProvider.fromEnvironmentVariable({
//       environmentVariableName: 'TEST_AUTH_TOKEN',
//     });
//   }
//   return _credsProvider;
// }
//
// let _sessionCredsProvider: CredentialProvider | undefined = undefined;
//
// function sessionCredsProvider(): CredentialProvider {
//   if (_sessionCredsProvider === undefined) {
//     _sessionCredsProvider = CredentialProvider.fromEnvironmentVariable({
//       environmentVariableName: 'TEST_SESSION_TOKEN',
//       // session tokens don't include cache/control endpoints, so we must provide them.  In this case we just hackily
//       // steal them from the auth-token-based creds provider.
//       endpointOverrides: {
//         cacheEndpoint: credsProvider().getCacheEndpoint(),
//         controlEndpoint: credsProvider().getControlEndpoint(),
//         tokenEndpoint: credsProvider().getTokenEndpoint(),
//         vectorEndpoint: credsProvider().getVectorEndpoint(),
//       },
//     });
//   }
//   return _sessionCredsProvider;
// }
//
// export function integrationTestCacheClientProps(): CacheClientPropsWithConfig {
//   return {
//     configuration:
//       Configurations.Laptop.latest().withClientTimeoutMillis(90000),
//     credentialProvider: credsProvider(),
//     defaultTtlSeconds: 1111,
//   };
// }
//
// function momentoClientForTesting(): CacheClient {
//   return new CacheClient(integrationTestCacheClientProps());
// }
//
// function momentoClientForTestingWithThrowOnErrors(): CacheClient {
//   const props = integrationTestCacheClientProps();
//   props.configuration = props.configuration.withThrowOnErrors(true);
//   return new CacheClient(props);
// }
//
// function momentoClientForTestingBalancedReadConcern(): CacheClient {
//   const props = integrationTestCacheClientProps();
//   props.configuration = props.configuration.withReadConcern(
//     ReadConcern.BALANCED
//   );
//   return new CacheClient(props);
// }
//
// function momentoClientForTestingExpressReadConcern(): CacheClient {
//   const props = integrationTestCacheClientProps();
//   props.configuration = props.configuration.withReadConcern(
//     ReadConcern.EXPRESS
//   );
//   return new CacheClient(props);
// }
//
// function momentoClientForTestingConsistentReadConcern(): CacheClient {
//   const props = integrationTestCacheClientProps();
//   props.configuration = props.configuration.withReadConcern(
//     ReadConcern.CONSISTENT
//   );
//   return new CacheClient(props);
// }
//
// function momentoClientForTestingWithSessionToken(): CacheClient {
//   return new CacheClient({
//     configuration:
//       Configurations.Laptop.latest().withClientTimeoutMillis(90000),
//     credentialProvider: sessionCredsProvider(),
//     defaultTtlSeconds: 1111,
//   });
// }
//
// function momentoTopicClientForTesting(): TopicClient {
//   return new TopicClient({
//     configuration: integrationTestCacheClientProps().configuration,
//     credentialProvider: integrationTestCacheClientProps().credentialProvider,
//   });
// }
//
// function momentoTopicClientWithThrowOnErrorsForTesting(): TopicClient {
//   return new TopicClient({
//     configuration:
//       integrationTestCacheClientProps().configuration.withThrowOnErrors(true),
//     credentialProvider: integrationTestCacheClientProps().credentialProvider,
//   });
// }
//
// function momentoTopicClientForTestingWithSessionToken(): TopicClient {
//   return new TopicClient({
//     configuration: integrationTestCacheClientProps().configuration,
//     credentialProvider: sessionCredsProvider(),
//   });
// }
//
// function momentoVectorClientForTesting(): PreviewVectorIndexClient {
//   return new PreviewVectorIndexClient({
//     credentialProvider: credsProvider(),
//     configuration: VectorIndexConfigurations.Laptop.latest(),
//   });
// }
//
// function momentoVectorClientWithThrowsOnErrorsForTesting(): PreviewVectorIndexClient {
//   return new PreviewVectorIndexClient({
//     credentialProvider: credsProvider(),
//     configuration:
//       VectorIndexConfigurations.Laptop.latest().withThrowOnErrors(true),
//   });
// }
//
// function momentoLeaderboardClientForTesting(): PreviewLeaderboardClient {
//   return new PreviewLeaderboardClient({
//     credentialProvider: credsProvider(),
//     configuration: LeaderboardConfigurations.Laptop.latest(),
//   });
// }
//
// function momentoLeaderboardClientWithThrowOnErrorsForTesting(): PreviewLeaderboardClient {
//   return new PreviewLeaderboardClient({
//     credentialProvider: credsProvider(),
//     configuration:
//       LeaderboardConfigurations.Laptop.latest().withThrowOnErrors(true),
//   });
// }
//
import {
  CacheClient,
  Configuration,
  Configurations,
  CreateCache,
  CredentialProvider,
  DeleteCache,
  MomentoErrorCode,
} from '@gomomento/sdk';
import {v4} from 'uuid';
import {CacheClientProps} from '@gomomento/sdk/dist/src/cache-client-props';

export interface CacheClientPropsWithConfig extends CacheClientProps {
  configuration: Configuration;
}

function testCacheName(): string {
  return (
    process.env.TEST_CACHE_NAME || `js-integration-test-compression-${v4()}`
  );
}

let _credsProvider: CredentialProvider | undefined = undefined;

export function credsProvider(): CredentialProvider {
  if (_credsProvider === undefined) {
    _credsProvider = CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'TEST_AUTH_TOKEN',
    });
  }
  return _credsProvider;
}

function integrationTestCacheClientProps(): CacheClientPropsWithConfig {
  return {
    configuration:
      Configurations.Laptop.latest().withClientTimeoutMillis(90000),
    credentialProvider: credsProvider(),
    defaultTtlSeconds: 1111,
  };
}

function momentoClientForTesting(): CacheClient {
  return new CacheClient(integrationTestCacheClientProps());
}

export function setupIntegrationTest(): {
  cacheClientPropsWithConfig: CacheClientPropsWithConfig;
  cacheName: string;
} {
  const cacheName = testCacheName();

  beforeAll(async () => {
    // Use a fresh client to avoid test interference with setup.
    const momento = momentoClientForTesting();
    await deleteCacheIfExists(momento, cacheName);
    const createResponse = await momento.createCache(cacheName);
    if (createResponse instanceof CreateCache.Error) {
      throw createResponse.innerException();
    }
  });

  afterAll(async () => {
    // Use a fresh client to avoid test interference with teardown.
    const momento = momentoClientForTesting();
    const deleteResponse = await momento.deleteCache(cacheName);
    if (deleteResponse instanceof DeleteCache.Error) {
      throw deleteResponse.innerException();
    }
  });

  return {
    cacheClientPropsWithConfig: integrationTestCacheClientProps(),
    cacheName: cacheName,
  };
}

/**
 * Jest doesn't provide a way to emit a custom message when a test fails, so this method
 * provides a wrapper to allow this:
 *
 * ```ts
 * it('fails a simple failing test', () => {
 *   const val = 42;
 *   expectWithMessage(() => {
 *     expect(val).toBeFalse();
 *   }, `it turns out ${val} is not false`);
 * });
 *```
 *
 * @param expected Function containing the `expect` assertion
 * @param message Message to be printed when the test fails
 */
export function expectWithMessage(expected: () => void, message: string) {
  try {
    expected();
  } catch (e) {
    if (e instanceof Error && e.stack !== undefined) {
      message += `\n\nOriginal stack trace:\n${e.stack}`;
    }
    throw new Error(message);
  }
}
//
// export function SetupTopicIntegrationTest(): {
//   topicClient: TopicClient;
//   topicClientWithThrowOnErrors: TopicClient;
//   cacheClient: CacheClient;
//   integrationTestCacheName: string;
// } {
//   const {cacheClient, integrationTestCacheName} = SetupIntegrationTest();
//   const topicClient = momentoTopicClientForTesting();
//   const topicClientWithThrowOnErrors =
//     momentoTopicClientWithThrowOnErrorsForTesting();
//   return {
//     topicClient,
//     topicClientWithThrowOnErrors,
//     cacheClient: cacheClient,
//     integrationTestCacheName: integrationTestCacheName,
//   };
// }
//
// export function SetupVectorIntegrationTest(): {
//   vectorClient: PreviewVectorIndexClient;
//   vectorClientWithThrowOnErrors: PreviewVectorIndexClient;
// } {
//   const vectorClient = momentoVectorClientForTesting();
//   const vectorClientWithThrowOnErrors =
//     momentoVectorClientWithThrowsOnErrorsForTesting();
//   return {vectorClient, vectorClientWithThrowOnErrors};
// }
//
// export function SetupLeaderboardIntegrationTest(): {
//   leaderboardClient: PreviewLeaderboardClient;
//   leaderboardClientWithThrowOnErrors: PreviewLeaderboardClient;
//   integrationTestCacheName: string;
// } {
//   const {integrationTestCacheName} = SetupIntegrationTest();
//   const leaderboardClient = momentoLeaderboardClientForTesting();
//   const leaderboardClientWithThrowOnErrors =
//     momentoLeaderboardClientWithThrowOnErrorsForTesting();
//   return {
//     leaderboardClient,
//     leaderboardClientWithThrowOnErrors,
//     integrationTestCacheName: integrationTestCacheName,
//   };
// }
//
// export function SetupAuthClientIntegrationTest(): {
//   sessionTokenAuthClient: AuthClient;
//   legacyTokenAuthClient: AuthClient;
//   sessionTokenCacheClient: CacheClient;
//   sessionTokenTopicClient: TopicClient;
//   authTokenAuthClientFactory: (authToken: string) => AuthClient;
//   cacheClientFactory: (token: string) => ICacheClient;
//   topicClientFactory: (token: string) => ITopicClient;
//   cacheName: string;
// } {
//   const cacheName = testCacheName();
//
//   beforeAll(async () => {
//     // Use a fresh client to avoid test interference with setup.
//     const momento = momentoClientForTestingWithSessionToken();
//     await deleteCacheIfExists(momento, cacheName);
//     const createResponse = await momento.createCache(cacheName);
//     if (createResponse instanceof CreateCache.Error) {
//       throw createResponse.innerException();
//     }
//   });
//
//   afterAll(async () => {
//     // Use a fresh client to avoid test interference with teardown.
//     const momento = momentoClientForTestingWithSessionToken();
//     const deleteResponse = await momento.deleteCache(cacheName);
//     if (deleteResponse instanceof DeleteCache.Error) {
//       throw deleteResponse.innerException();
//     }
//   });
//
//   return {
//     sessionTokenAuthClient: new AuthClient({
//       credentialProvider: sessionCredsProvider(),
//     }),
//     legacyTokenAuthClient: new AuthClient({
//       credentialProvider: CredentialProvider.fromEnvironmentVariable({
//         environmentVariableName: 'TEST_LEGACY_AUTH_TOKEN',
//       }),
//     }),
//     sessionTokenCacheClient: momentoClientForTestingWithSessionToken(),
//     sessionTokenTopicClient: momentoTopicClientForTestingWithSessionToken(),
//     authTokenAuthClientFactory: authToken => {
//       return new AuthClient({
//         credentialProvider: CredentialProvider.fromString({
//           authToken: authToken,
//         }),
//       });
//     },
//     cacheClientFactory: authToken =>
//       new CacheClient({
//         credentialProvider: CredentialProvider.fromString({
//           authToken: authToken,
//         }),
//         configuration: Configurations.Laptop.latest(),
//         defaultTtlSeconds: 60,
//       }),
//     topicClientFactory: authToken =>
//       new TopicClient({
//         credentialProvider: CredentialProvider.fromString({
//           authToken: authToken,
//         }),
//         configuration: Configurations.Laptop.latest(),
//       }),
//     cacheName: cacheName,
//   };
// }
//
// export interface ValidateCacheProps {
//   cacheName: string;
// }
//
// export interface ValidateSortedSetProps extends ValidateCacheProps {
//   sortedSetName: string;
//   value: string | Uint8Array;
// }
//
// export interface ValidateSortedSetChangerProps extends ValidateSortedSetProps {
//   score: number;
//   ttl?: CollectionTtl;
// }
//
// export function delay(ms: number): Promise<unknown> {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
