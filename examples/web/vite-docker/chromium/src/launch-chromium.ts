// import playwright = require('playwright-aws-lambda');
import * as playwright from '@playwright/test';

async function launchChromium(): Promise<void> {
  console.log('hello world');

  const browser = await playwright.chromium.launch({headless: true});
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://apache');
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

launchChromium().catch(e => {
  throw e;
});
