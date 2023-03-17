import {
  CacheClient,
  Configurations,
  CredentialProvider,
  ListCaches,
} from '@gomomento/sdk';

async function main() {
  const momento = new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_AUTH_TOKEN',
    }),
    defaultTtlSeconds: 60,
  });

  const cachesResponse = await momento.listCaches();

  let caches;
  if (cachesResponse instanceof ListCaches.Success) {
    caches = cachesResponse.getCaches();
  } else {
    throw new Error('List caches failed');
  }

  for (const cache of caches) {
    console.log(`Deleting cache: ${cache.getName()}`);
    await momento.deleteCache(cache.getName());
  }
}

main().catch(e => {
  throw e;
});
