import {
  CredentialProvider,
  DefaultMomentoLoggerFactory,
  DefaultMomentoLoggerLevel,
  TopicClient,
  TopicConfigurations,
  TopicItem,
  TopicSubscribe
} from '@gomomento/sdk';
import {ensureCacheExists} from './utils/cache';

async function main() {
  const clargs = process.argv.slice(2);
  if (clargs.length !== 2) {
    console.error('Usage: topic-subscribe.ts <cacheName> <topicName>');
    return;
  }
  const [cacheName, topicName] = clargs;
  const loggerFactory = new DefaultMomentoLoggerFactory(DefaultMomentoLoggerLevel.INFO);
  const momento = new TopicClient({
    configuration: TopicConfigurations.Default.latest(loggerFactory),
    credentialProvider: CredentialProvider.fromEnvironmentVariable('MOMENTO_API_KEY'),
  });

  await ensureCacheExists(cacheName);

  console.log(`Subscribing to cacheName=${cacheName}, topicName=${topicName}`);
  const response = await momento.subscribe(cacheName, topicName, {
    onItem: handleItem,
    onError: handleError,
  });

  if (response instanceof TopicSubscribe.Subscription) {
    console.log('Subscribed to topic');
  } else {
    console.log(`Error subscribing to topic: ${response.toString()}`);
    return;
  }

  const sleep = (seconds: number) => new Promise(r => setTimeout(r, seconds * 1000));

  const endTime = Date.now() + 10 * 60 * 1000;
  while (Date.now() < endTime) {
    await sleep(5);
    // const publishResponse = await momento.publish(cacheName, topicName, 'PONG');
    // console.log(`Sent PONG message: ${publishResponse.toString()}`);
  }
  //
  // // Wait a couple minutes to receive some items, then unsubscribe to finish the example.
  // await sleep(120);

  console.log('Unsubscribing from topic subscription. Restart the example to subscribe again.');
  response.unsubscribe();
}

function handleItem(item: TopicItem) {
  console.log('Item received from topic subscription; %s', item.valueString());
}

function handleError(error: TopicSubscribe.Error) {
  console.log(`Error received from topic subscription; ${error.toString()}`);

  // optionally: unsubscribe from the topic subscription
  //subscription.unsubscribe();
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
