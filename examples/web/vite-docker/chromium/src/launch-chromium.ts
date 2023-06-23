import * as playwright from '@playwright/test';

async function launchChromium(): Promise<void> {
  console.log('hello world');

  const browser = await playwright.chromium.launch({headless: true});
  // TODO: make configurable
  const numBrowsers = 10;
  // TODO: for now we have to choose the URL based on whether we are running locally in
  // docker-compose, or running in ECS.
  // Uncomment this line for docker compose environment:
  const url = 'http://webserver';
  // OR, Uncomment this line for ECS environment:
  //const url = 'http://webserver.topics.momento';
  const browserContexts = await Promise.all(
    range(numBrowsers).map(() => browser.newContext())
  );
  console.log(`Created ${numBrowsers} browsers`);

  // const context = await browser.newContext();
  await Promise.all(
    browserContexts.map(async (context, index) => {
      console.log(`Browser ${index} loading page`);
      const page = await context.newPage();
      await page.goto(url);
      console.log(`Browser ${index} done loading page:`);
      console.log(await page.content());
    })
  );

  console.log('Closing browser');
  await browser.close();

  console.log('done');
}

function range(count: number): Array<number> {
  return [...Array(count).keys()];
}

launchChromium().catch(e => {
  throw e;
});
