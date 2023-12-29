import {CacheGet, CreateCache, CacheSet, CacheClient, Configurations, CredentialProvider} from '@gomomento/sdk';

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const config = Configurations.Laptop.v1().withThrowOnErrors(true);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  console.error(`CONFIG WITH THROW ON ERRORS: ${config.getThrowOnErrors()}`);
  const cacheClient = await CacheClient.create({
    configuration: Configurations.Laptop.v1().withThrowOnErrors(true),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_API_KEY',
    }),
    defaultTtlSeconds: 60,
  });

  const setResponse = await cacheClient.set('cache', 'foo', 'abcxyz');
  console.log(`SET RESPONSE: ${setResponse.toString()}`);

  const incrementResponse = await cacheClient.increment('cache', 'foo', 1);
  console.log(`INCREMENT RESPONSE: ${incrementResponse.toString()}`);

  //
  // const createCacheResponse = await momento.createCache('cache');
  // if (createCacheResponse instanceof CreateCache.AlreadyExists) {
  //   console.log('cache already exists');
  // } else if (createCacheResponse instanceof CreateCache.Error) {
  //   throw createCacheResponse.innerException();
  // }
  //
  // console.log('Storing key=foo, value=FOO');
  // const setResponse = await momento.set('cache', 'foo', 'FOO');
  // if (setResponse instanceof CacheSet.Success) {
  //   console.log('Key stored successfully!');
  // } else {
  //   console.log(`Error setting key: ${setResponse.toString()}`);
  // }
  //
  // const getResponse = await momento.get('cache', 'foo');
  // if (getResponse instanceof CacheGet.Hit) {
  //   console.log(`cache hit: ${getResponse.valueString()}`);
  // } else if (getResponse instanceof CacheGet.Miss) {
  //   console.log('cache miss');
  // } else if (getResponse instanceof CacheGet.Error) {
  //   console.log(`Error: ${getResponse.message()}`);
  // }
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
