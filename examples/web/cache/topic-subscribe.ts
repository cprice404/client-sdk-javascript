import {TopicClient, TopicItem, TopicSubscribe, CredentialProvider, TopicConfigurations} from '@gomomento/sdk-web';
import {ensureCacheExists} from './utils/cache';
// import * as globalJsdom from 'global-jsdom';

// import {JSDOM, ResourceLoader, VirtualConsole} from 'jsdom';

async function main() {
  initJSDom();

  const clargs = process.argv.slice(2);
  if (clargs.length !== 2) {
    console.error('Usage: topic-subscribe.ts <cacheName> <topicName>');
    return;
  }
  const [cacheName, topicName] = clargs;
  const momento = new TopicClient({
    configuration: TopicConfigurations.Default.latest(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_AUTH_TOKEN',
    }),
  });

  await ensureCacheExists(cacheName);

  console.log(`Subscribing to cacheName=${cacheName}, topicName=${topicName}`);
  const response = await momento.subscribe(cacheName, topicName, {
    onItem: handleItem,
    onError: handleError,
  });

  if (response instanceof TopicSubscribe.Subscription) {
    console.log('Subscribed to topic');
  } else if (response instanceof TopicSubscribe.Error) {
    console.log(`Error subscribing to topic: ${response.toString()}`);
    return;
  } else {
    console.log(`Unexpected response from topic subscription: ${response.toString()}`);
    return;
  }

  const sleep = (seconds: number) => new Promise(r => setTimeout(r, seconds * 1000));

  // Wait a couple minutes to receive some items, then unsubscribe to finish the example.
  await sleep(120);

  if (response instanceof TopicSubscribe.Subscription) {
    console.log('Unsubscribing from topic subscription. Restart the example to subscribe again.');
    response.unsubscribe();
  }
}

function handleItem(item: TopicItem) {
  console.log('Item received from topic subscription; %s', item);
}

function handleError(error: TopicSubscribe.Error) {
  console.log(`Error received from topic subscription; ${error.toString()}`);

  // optionally: unsubscribe from the topic subscription
  //subscription.unsubscribe();
}

// The `Window` interface does not have an `Error.stackTraceLimit` property, but
// `JSDOMEnvironment` assumes it is there.
// type Win = Window &
//   Global.Global & {
//     Error: {
//       stackTraceLimit: number;
//     };
//   };

function initJSDom() {
  //
  // const virtualConsole = new VirtualConsole();
  // virtualConsole.sendTo(context.console, {omitJSDOMErrors: true});
  // virtualConsole.on('jsdomError', error => {
  //   context.console.error(error);
  // });
  //
  // const dom = new JSDOM(
  //   '<!DOCTYPE html>',
  //   // typeof projectConfig.testEnvironmentOptions.html === 'string'
  //   //   ? projectConfig.testEnvironmentOptions.html
  //   //   : '<!DOCTYPE html>',
  //   {
  //     pretendToBeVisual: true,
  //     resources:
  //       // typeof projectConfig.testEnvironmentOptions.userAgent === 'string'
  //       //   ? new ResourceLoader({
  //       //     userAgent: projectConfig.testEnvironmentOptions.userAgent,
  //       //   })
  //       //   : undefined,
  //       undefined,
  //     runScripts: 'dangerously',
  //     url: 'http://localhost/',
  //     virtualConsole,
  //     // ...projectConfig.testEnvironmentOptions,
  //   }
  // );
  // // const global = (this.global = this.dom.window as unknown as Win);
  // // this.global = dom.window as unknown as Win);
  // global.window = dom.window as unknown;
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
