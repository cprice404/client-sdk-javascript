import {
  CacheGet,
  ListCaches,
  CreateCache,
  CacheSet,
  CacheDelete,
  CacheDictionarySetField,
  CacheDictionaryIncrement,
  LogLevel,
  LogFormat,
  SimpleCacheClient,
  EnvMomentoTokenProvider,
  Configurations,
  LoggerOptions,
} from '@gomomento/sdk';

const cacheName = 'cache';
const cacheKey = 'key';
const cacheValue = 'value';

const credentialsProvider = new EnvMomentoTokenProvider({
  environmentVariableName: 'MOMENTO_AUTH_TOKEN',
});

const loggerOptions: LoggerOptions = {
  level: LogLevel.DEBUG,
  format: LogFormat.CONSOLE,
};

const defaultTtl = 60;
const momento = new SimpleCacheClient({
  configuration: Configurations.Laptop.latest(loggerOptions),
  credentialProvider: credentialsProvider,
  defaultTtlSeconds: defaultTtl,
});

const main = async () => {
  const createCacheResponse = await momento.createCache(cacheName);
  if (createCacheResponse instanceof CreateCache.AlreadyExists) {
    console.log('cache already exists');
  } else if (createCacheResponse instanceof CreateCache.Error) {
    throw createCacheResponse.innerException();
  }

  const dictionarySetResult = await momento.dictionarySetField(
    cacheName,
    'my_dictionary',
    'my_counter',
    '9223372036854775807'
  );
  if (dictionarySetResult instanceof CacheDictionarySetField.Success) {
    console.log('Set the initial counter value in the dictionary!');
  }

  const dictionaryIncrementResult = await momento.dictionaryIncrement(
    cacheName,
    'my_dictionary',
    'my_counter',
    1
  );
  if (dictionaryIncrementResult instanceof CacheDictionaryIncrement.Success) {
    console.log('Increment succeeded!');
  } else if (
    dictionaryIncrementResult instanceof CacheDictionaryIncrement.Error
  ) {
    console.log(
      `Increment failed! ${dictionaryIncrementResult.errorCode()}: ${dictionaryIncrementResult.toString()}`
    );
  }

  //
  // console.log('Listing caches:');
  // let token: string | undefined;
  // do {
  //   const listResponse = await momento.listCaches(token);
  //   if (listResponse instanceof ListCaches.Error) {
  //     console.log(`Error listing caches: ${listResponse.message()}`);
  //     break;
  //   } else if (listResponse instanceof ListCaches.Success) {
  //     listResponse.getCaches().forEach(cacheInfo => {
  //       console.log(`${cacheInfo.getName()}`);
  //     });
  //     token = listResponse.getNextToken();
  //   }
  // } while (token !== undefined);
  //
  // const exampleTtlSeconds = 10;
  // console.log(
  //   `Storing key=${cacheKey}, value=${cacheValue}, ttl=${exampleTtlSeconds}`
  // );
  // const setResponse = await momento.set(
  //   cacheName,
  //   cacheKey,
  //   cacheValue,
  //   exampleTtlSeconds
  // );
  // if (setResponse instanceof CacheSet.Success) {
  //   console.log(
  //     'Key stored successfully with value ' + setResponse.valueString()
  //   );
  // } else if (setResponse instanceof CacheSet.Error) {
  //   console.log('Error setting key: ' + setResponse.message());
  // }
  //
  // const getResponse = await momento.get(cacheName, cacheKey);
  // if (getResponse instanceof CacheGet.Hit) {
  //   console.log(`cache hit: ${String(getResponse.valueString())}`);
  // } else if (getResponse instanceof CacheGet.Miss) {
  //   console.log('cache miss');
  // } else if (getResponse instanceof CacheGet.Error) {
  //   console.log(`Error: ${getResponse.message()}`);
  // }
  //
  // const deleteResponse = await momento.delete(cacheName, cacheKey);
  // if (deleteResponse instanceof CacheDelete.Error) {
  //   console.log(`Error deleting cache key: ${deleteResponse.message()}`);
  // } else if (deleteResponse instanceof CacheDelete.Success) {
  //   console.log('Deleted key from cache');
  // }
};

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`failed to get from cache ${e.message}`);
    throw e;
  });
