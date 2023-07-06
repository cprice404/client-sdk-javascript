// import {
//   CacheGet,
//   CreateCache,
//   CacheSet,
//   CacheClient,
//   Configurations,
//   CredentialProvider,
//   DeleteCache,
//   AuthClient,
//   AllDataReadWrite,
//   ExpiresIn,
//   GenerateAuthToken,
//   ListCaches,
//   RefreshAuthToken,
//   TokenScope,
//   Permissions,
//   CachePermission,
//   TopicPermission,
//   CacheRole,
//   TopicRole,
//   AllCaches,
//   AllTopics,
// } from '@gomomento/sdk';
//
// async function example_API_CreateCache(cacheClient: CacheClient, cacheName: string) {
//   const result = await cacheClient.createCache(cacheName);
//   if (result instanceof CreateCache.Success) {
//     console.log(`Cache ${cacheName} created`);
//   } else if (result instanceof CreateCache.AlreadyExists) {
//     console.log(`Cache ${cacheName} already exists`);
//   } else if (result instanceof CreateCache.Error) {
//     throw new Error(
//       `An error occurred while attempting to create cache ${cacheName}: ${result.errorCode()}: ${result.toString()}`
//     );
//   }
// }
//
// async function example_API_DeleteCache(cacheClient: CacheClient, cacheName: string) {
//   const result = await cacheClient.deleteCache(cacheName);
//   if (result instanceof DeleteCache.Success) {
//     console.log(`Cache ${cacheName} deleted`);
//   } else if (result instanceof DeleteCache.Error) {
//     throw new Error(
//       `An error occurred while attempting to delete cache ${cacheName}: ${result.errorCode()}: ${result.toString()}`
//     );
//   }
// }
//
// async function example_API_Set(cacheClient: CacheClient, cacheName: string, key: string, value: string) {
//   const result = await cacheClient.set(cacheName, key, value);
//   if (result instanceof CacheSet.Success) {
//     console.log(`Key ${key} stored successfully in ${cacheName}`);
//   } else if (result instanceof CacheSet.Error) {
//     throw new Error(
//       `An error occurred while attempting to store key ${key} in cache ${cacheName}: ${result.errorCode()}: ${result.toString()}`
//     );
//   }
// }
//
// async function example_API_Get(cacheClient: CacheClient, cacheName: string, key: string) {
//   const result = await cacheClient.get(cacheName, key);
//   if (result instanceof CacheGet.Hit) {
//     console.log(`Retrieved value for key ${key} in cache ${cacheName}: ${result.valueString()}`);
//   } else if (result instanceof CacheGet.Miss) {
//     console.log(`Key ${key} was not found in cache ${cacheName}`);
//   } else if (result instanceof CacheGet.Error) {
//     throw new Error(
//       `An error occurred while attempting to get key ${key} from cache ${cacheName}: ${result.errorCode()}: ${result.toString()}`
//     );
//   }
// }
//
// async function generateAuthToken(
//   authClient: AuthClient,
//   scope: TokenScope,
//   durationSeconds: number
// ): Promise<[string, string]> {
//   const generateTokenResponse = await authClient.generateAuthToken(scope, ExpiresIn.seconds(durationSeconds));
//   if (generateTokenResponse instanceof GenerateAuthToken.Success) {
//     console.log(`Generated an auth token with ${scope} scope at time ${Date.now() / 1000}!`);
//     console.log('Logging only a substring of the tokens, because logging security credentials is not advisable:');
//     console.log(`Auth token: ${generateTokenResponse.authToken.substring(0, 10)}`);
//     console.log(`Refresh token: ${generateTokenResponse.refreshToken.substring(0, 10)}`);
//     console.log(`Expires At: ${generateTokenResponse.expiresAt.epoch()}`);
//     return [generateTokenResponse.authToken, generateTokenResponse.refreshToken];
//   } else {
//     throw new Error(`Failed to generate auth token: ${generateTokenResponse}`);
//   }
// }
//
// const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
//
// async function main() {
//   const mainCredsProvider = CredentialProvider.fromEnvironmentVariable({
//     environmentVariableName: 'MOMENTO_AUTH_TOKEN',
//   });
//   const mainAuthClient = new AuthClient({
//     credentialProvider: mainCredsProvider,
//   });
//   const mainCacheClient = new CacheClient({
//     configuration: Configurations.Laptop.v1(),
//     credentialProvider: mainCredsProvider,
//     defaultTtlSeconds: 60,
//   });
//
//   // Set up a cache
//   const CACHE_OPEN_DOOR = 'open-door';
//   await example_API_CreateCache(mainCacheClient, CACHE_OPEN_DOOR);
//   await example_API_Set(mainCacheClient, CACHE_OPEN_DOOR, 'hello', 'world');
//
//   // Create a token valid for 60 seconds that can only read a specific cache 'open-door'
//   const oneCacheReadOnlyPermissions = new Permissions([
//     new CachePermission(CacheRole.ReadOnly, {
//       cache: {name: CACHE_OPEN_DOOR},
//     }),
//   ]);
//
//   const [scopedToken, scopedRefreshToken] = await generateAuthToken(mainAuthClient, oneCacheReadOnlyPermissions, 60);
//   const scopedTokenCacheClient = new CacheClient({
//     configuration: Configurations.Laptop.v1(),
//     credentialProvider: CredentialProvider.fromString({authToken: scopedToken}),
//     defaultTtlSeconds: 60,
//   });
//
//   await example_API_Get(scopedTokenCacheClient, CACHE_OPEN_DOOR, 'goodbye');
//   await example_API_Get(scopedTokenCacheClient, CACHE_OPEN_DOOR, 'hello');
//   try {
//     await example_API_Set(scopedTokenCacheClient, CACHE_OPEN_DOOR, 'hello', 'world');
//   } catch (error) {
//     console.log(`Caught expected permissions error - Writes not allowed with a read-only token ${error}`);
//   }
//
//   // Clean up caches created
//   await example_API_DeleteCache(mainCacheClient, CACHE_OPEN_DOOR);
//
//   // Scoped tokens with other possible permissions
//
//   // Create a token that can
//   // - Read and write cache CACHE_OPEN_DOOR
//   // - Read and write topic 'highlights' within a specific cache 'the-great-wall'
//   // - Read all caches
//   // - Read all topics across all caches
//   const tokenValidForSeconds = 60;
//   const permissions = new Permissions([
//     new CachePermission(CacheRole.ReadWrite, {
//       cache: {name: CACHE_OPEN_DOOR},
//     }),
//     new TopicPermission(TopicRole.ReadWrite, {
//       cache: {name: 'the-great-wall'},
//       topic: {name: 'highlights'},
//     }),
//     new CachePermission(CacheRole.ReadOnly, {
//       cache: AllCaches,
//     }),
//     new TopicPermission(TopicRole.ReadOnly, {
//       cache: AllCaches,
//       topic: AllTopics,
//     }),
//   ]);
//
//   const [scopedToken1, scopedRefreshToken1] = await generateAuthToken(
//     mainAuthClient,
//     permissions,
//     tokenValidForSeconds
//   );
//   // Do something with the token.
// }
//
// main()
//   .then(() => {
//     console.log('success!!');
//   })
//   .catch((e: Error) => {
//     console.error(`Uncaught exception while running example: ${e.message}`);
//     throw e;
//   });
