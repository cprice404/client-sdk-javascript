import {
  AutomaticDecompression,
  CacheClient,
  CacheGet,
  CacheSet,
  CompressionMode,
  Configurations,
  CreateCache,
  CredentialProvider,
} from '@gomomento/sdk';
// import {CompressionExtensions} from '@gomomento/sdk-nodejs-compression';

async function main() {
  const momento = await CacheClient.create({
    configuration: Configurations.Laptop.v1(),
    // configuration: Configurations.Laptop.v1().withCompression({
    //   compressionExtensions: CompressionExtensions.load(),
    //   automaticDecompression: AutomaticDecompression.Enabled,
    // }),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_API_KEY',
    }),
    defaultTtlSeconds: 60,
  });

  const createCacheResponse = await momento.createCache('cache');
  if (createCacheResponse instanceof CreateCache.AlreadyExists) {
    console.log('cache already exists');
  } else if (createCacheResponse instanceof CreateCache.Error) {
    throw createCacheResponse.innerException();
  }

  console.log('Storing key=foo, value=FOO');
  const setResponse = await momento.set('cache', 'foo', 'FOO', {
    compression: CompressionMode.Fast,
  });
  // const setResponse = await momento.set('cache', 'foo', 'FOO');
  if (setResponse instanceof CacheSet.Success) {
    console.log('Key stored successfully!');
  } else {
    console.log(`Error setting key: ${setResponse.toString()}`);
  }

  const getResponse = await momento.get('cache', 'foo');
  if (getResponse instanceof CacheGet.Hit) {
    console.log(`cache hit: ${getResponse.valueString()}`);
  } else if (getResponse instanceof CacheGet.Miss) {
    console.log('cache miss');
  } else if (getResponse instanceof CacheGet.Error) {
    console.log(`Error: ${getResponse.message()}`);
  }
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
