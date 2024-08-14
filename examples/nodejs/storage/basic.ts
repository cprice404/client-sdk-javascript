import {
  CredentialProvider,
  DefaultMomentoLoggerFactory,
  DefaultMomentoLoggerLevel,
  PreviewStorageClient,
  StorageConfigurations,
} from '@gomomento/sdk';
import {DefaultStorageRetryStrategy} from '@gomomento/sdk/dist/src/config/retry/storage-default-retry-strategy';

async function main() {
  const loggerFactory = new DefaultMomentoLoggerFactory(DefaultMomentoLoggerLevel.TRACE);

  // const origConfig = StorageConfigurations.Laptop.latest(loggerFactory);
  // const retryStrategy = new DefaultStorageRetryStrategy({
  //
  // })

  const storageClient = new PreviewStorageClient({
    configuration: StorageConfigurations.Laptop.latest(loggerFactory),
    credentialProvider: CredentialProvider.fromEnvironmentVariable('MOMENTO_API_KEY').withMomentoLocal(),
  });

  const putResponse = await storageClient.putInt('store', 'key', 42);
  console.log(`putInt: ${putResponse.toString()}`);
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
