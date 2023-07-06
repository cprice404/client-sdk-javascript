import {
  AllDataReadWrite,
  AuthClient,
  CacheClient,
  CacheDictionaryFetch,
  CacheDictionaryGetFields,
  CacheDictionarySetFields,
  CacheListConcatenateFront,
  CacheListFetch,
  CachePermission,
  CacheRole,
  Configurations,
  CreateCache,
  CredentialProvider,
  ExpiresIn,
  GenerateAuthToken,
  Permissions,
  TokenScope,
} from '@gomomento/sdk';

async function main() {
  const superUserToken = getRequiredEnvVar('MOMENTO_AUTH_TOKEN');
  const credentialProvider = CredentialProvider.fromEnvironmentVariable({
    environmentVariableName: 'MOMENTO_AUTH_TOKEN',
  });
  const superUserCacheClient = cacheClient(superUserToken);
  const superUserAuthClient = new AuthClient({credentialProvider: credentialProvider});

  const cacheName1 = 'authz-bugbash1';
  const cacheName2 = 'authz-bugbash2';
  const createCacheResult = await superUserCacheClient.createCache(cacheName1);
  if (createCacheResult instanceof CreateCache.Error) {
    throw createCacheResult.innerException();
  }
  const createCacheResult2 = await superUserCacheClient.createCache(cacheName2);
  if (createCacheResult2 instanceof CreateCache.Error) {
    throw createCacheResult2.innerException();
  }

  // const allDataReadWriteToken = await generateToken(superUserAuthClient, AllDataReadWrite);
  // console.log(`AllDataReadWriteToken: ${allDataReadWriteToken}`);
  // const allDataCacheClient = cacheClient(allDataReadWriteToken);
  // console.log('Reading/writing cache with allDataCacheClient');
  // const listConcatResponse = await allDataCacheClient.listConcatenateFront(cacheName, 'my-list', ['foo', 'bar', 'baz']);
  // if (listConcatResponse instanceof CacheListConcatenateFront.Success) {
  //   console.log('AllDataReadWrite user successfully wrote list');
  // } else {
  //   throw new Error(`Something went wrong when writing list: ${listConcatResponse.toString()}`);
  // }
  // const listFetchResponse = await allDataCacheClient.listFetch(cacheName, 'my-list');
  // if (listFetchResponse instanceof CacheListFetch.Hit) {
  //   if (arrayEquals(listFetchResponse.valueListString(), ['foo', 'bar', 'baz'])) {
  //     console.log('AllDataReadWrite user successfully wrote and read a list.');
  //   } else {
  //     throw new Error(`Something went wrong when fetching list: ${listFetchResponse.toString()}`);
  //   }
  // } else {
  //   throw new Error(`Something went wrong when fetching list: ${listFetchResponse.toString()}`);
  // }

  const singleCacheReadWriteToken = await generateToken(
    superUserAuthClient,
    new Permissions([new CachePermission(CacheRole.ReadWrite, {cache: cacheName1})])
  );
  console.log(`SingleCacheReadWrite Token: ${singleCacheReadWriteToken}`);
  const singleCacheReadWriteClient = cacheClient(singleCacheReadWriteToken);
  console.log('Reading/writing cache with SingleCacheReadWrite client');
  const dictionarySetFieldsResponse = await singleCacheReadWriteClient.dictionarySetFields(
    cacheName1,
    'my-dictionary',
    {
      foo: 'FOO',
      bar: 'BAR',
      baz: 'BAZ',
    }
  );
  if (dictionarySetFieldsResponse instanceof CacheDictionarySetFields.Success) {
    console.log('SingleCacheReadWrite  user successfully wrote dictionary');
  } else {
    throw new Error(`Something went wrong when writing dictionary: ${dictionarySetFieldsResponse.toString()}`);
  }
  const dictionaryFetchResponse = await singleCacheReadWriteClient.dictionaryFetch(cacheName1, 'my-dictionary');
  if (dictionaryFetchResponse instanceof CacheDictionaryFetch.Hit) {
    if (recordEquals(dictionaryFetchResponse.valueRecord(), {foo: 'FOO', bar: 'BAR', baz: 'BAZ'})) {
      console.log('SingleCacheReadWrite  user successfully wrote and read a dictionary.');
    } else {
      throw new Error(`Something went wrong when fetching dictionary: ${dictionaryFetchResponse.toString()}`);
    }
  } else {
    throw new Error(`Something went wrong when fetching dictionary: ${dictionaryFetchResponse.toString()}`);
  }
}

function getRequiredEnvVar(envVarName: string): string {
  const val = process.env[envVarName];
  if (val !== undefined) {
    return val;
  }
  throw new Error(`Missing required env var ${envVarName}`);
}

function cacheClient(token: string): CacheClient {
  return new CacheClient({
    configuration: Configurations.Laptop.latest(),
    credentialProvider: CredentialProvider.fromString({authToken: token}),
    defaultTtlSeconds: 60,
  });
}

async function generateToken(authClient: AuthClient, tokenScope: TokenScope): Promise<string> {
  const response = await authClient.generateAuthToken(tokenScope, ExpiresIn.hours(1));
  if (response instanceof GenerateAuthToken.Success) {
    return response.authToken;
  }
  throw new Error(`Unexpected response: ${response.toString()}`);
}

function arrayEquals(a: Array<string>, b: Array<string>) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

function recordEquals(a: Record<string, string>, b: Record<string, string>) {
  return JSON.stringify(a) === JSON.stringify(b);
}

main().catch(e => {
  throw e;
});
