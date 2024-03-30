import {
  CacheGet,
  CreateCache,
  CacheSet,
  CacheClient,
  Configurations,
  CredentialProvider,
  Middleware,
  MiddlewareRequestHandler,
} from '@gomomento/sdk';
import {
  MiddlewareMessage,
  MiddlewareMetadata,
  MiddlewareRequestHandlerContext,
  MiddlewareStatus,
} from '@gomomento/sdk/dist/src/config/middleware/middleware';

class FooMiddlewareRequestHandler implements MiddlewareRequestHandler {
  async onRequestMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata> {
    console.log('FooMiddlewareRequestHandler.onRequestMetadata enter');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return metadata;
  }
  onRequestBody(request: MiddlewareMessage): Promise<MiddlewareMessage> {
    return Promise.resolve(request);
  }
  onResponseMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata> {
    return Promise.resolve(metadata);
  }
  onResponseBody(response: MiddlewareMessage | null): Promise<MiddlewareMessage | null> {
    return Promise.resolve(response);
  }
  onResponseStatus(status: MiddlewareStatus): Promise<MiddlewareStatus> {
    return Promise.resolve(status);
  }
}

class FooMiddleware implements Middleware {
  onNewRequest(context?: MiddlewareRequestHandlerContext): MiddlewareRequestHandler {
    return new FooMiddlewareRequestHandler();
  }
}

async function main() {
  const momento = await CacheClient.create({
    configuration: Configurations.Laptop.v1().withMiddlewares([new FooMiddleware()]),
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
  const setResponse = await momento.set('cache', 'foo', 'FOO');
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
