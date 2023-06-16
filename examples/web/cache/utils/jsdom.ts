// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const JSDOM = require('jsdom');

const defaultHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

export function initJSDom(html = defaultHtml, options = {}) {
  // Idempotency
  if (
    global.navigator &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    global.navigator.userAgent &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    global.navigator.userAgent.includes('Node.js') &&
    global.document &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof global.document.destroy === 'function'
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return global.document.destroy;
  }

  // set a default url if we don't get one - otherwise things explode when we copy localstorage keys
  if (!('url' in options)) {
    Object.assign(options, {url: 'http://localhost:3000'});
  }

  // enable pretendToBeVisual by default since react needs
  // window.requestAnimationFrame, see https://github.com/jsdom/jsdom#pretending-to-be-a-visual-browser
  if (!('pretendToBeVisual' in options)) {
    Object.assign(options, {pretendToBeVisual: true});
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const jsdom = new JSDOM.JSDOM(html, options);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {window} = jsdom;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {document} = window;

  // generate our list of keys by enumerating document.window - this list may vary
  // based on the jsdom version. filter out internal methods as well as anything
  // that node already defines

  const KEYS = [];

  if (KEYS.length === 0) {
    KEYS.push(...Object.getOwnPropertyNames(window).filter(k => !k.startsWith('_') && !(k in global)));
    // going to add our jsdom instance, see below
    KEYS.push('$jsdom');
  }
  // eslint-disable-next-line no-return-assign,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
  KEYS.forEach(key => (global[key] = window[key]));

  // setup document / window / window.console
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  global.document = document;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  global.window = window;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  window.console = global.console;

  // add access to our jsdom instance
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  global.$jsdom = jsdom;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const cleanup = () => KEYS.forEach(key => delete global[key]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  document.destroy = cleanup;

  return cleanup;
}

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
