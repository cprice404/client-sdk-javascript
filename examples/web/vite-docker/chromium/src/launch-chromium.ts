// import playwright = require('playwright-aws-lambda');
import * as playwright from '@playwright/test';

async function launchChromium(): Promise<void> {
  console.log('hello world');

  const browser = await playwright.chromium.launch({headless: true});
  // TODO: make configurable
  const numBrowsers = 10;
  // TODO: this only works in the docker compose setup, needs to use service discovery to work in ECS
  const url = 'http://apache';
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
      console.log(`Browser ${index} done loading page`);
    })
  );

  console.log('Closing browser');
  await browser.close();

  //
  // const browser = await playwright.launchChromium();
  // await browser.newContext();

  console.log('done');

  //
  // let browser;
  // try {
  //   browser = await playwright.launchChromium();
  //   //
  //   // const context = await browser.newContext();
  //   // const page = await context.newPage();
  //   // await page.goto(env.consoleUrl);
  //   //
  //   // const loginInput = page.getByLabel('Email address');
  //   // await loginInput.fill('github-integration@botmail.momentohq.com');
  //   //
  //   // await page.getByRole('button', {name: 'Continue', exact: true}).click();
  //   //
  //   // console.log('Login attempt initiated; Continue button clicked.');
  //   //
  //   // console.log(
  //   //   `Waiting up to 5 minutes for a message on SQS queue: ${validationQueueUrl}`
  //   // );
}
//
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function range(count: number): Array<number> {
  return [...Array(count).keys()];
}

launchChromium().catch(e => {
  throw e;
});
