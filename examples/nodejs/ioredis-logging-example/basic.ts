import {CreateCache, CacheClient, Configurations, CredentialProvider} from '@gomomento/sdk';
import {MomentoRedisAdapter} from '@gomomento-poc/node-ioredis-client';
import {LoggingMiddleware} from './logging-middleware';

async function main() {
  const momento = await CacheClient.create({
    configuration: Configurations.Laptop.v1().withMiddlewares([new LoggingMiddleware()]),
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

  const redis = new MomentoRedisAdapter(momento, 'cache');

  await redis.hmset('my_dictionary', {foo: 'FOO', bar: 'BAR'});
  await redis.hgetall('my_dictionary');
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
