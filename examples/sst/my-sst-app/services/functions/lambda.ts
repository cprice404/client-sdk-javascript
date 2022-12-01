import {APIGatewayProxyHandlerV2} from "aws-lambda";
import {CacheGetStatus, LogLevel, SimpleCacheClient} from "./momento";


function getEnvVarOrThrowError(envVarName: string): string {
  const result = process.env[envVarName];
  if (result === undefined) {
    throw new Error(`Missing required env var: ${envVarName}`)
  }
  return result;
}

async function getCacheValue(cacheClient: SimpleCacheClient): Promise<string> {
  const cachedValue = await cacheClient.get(CACHE_NAME, CACHE_KEY);
  if (cachedValue.status === CacheGetStatus.Hit) {
    console.log(`got a hit on first try!`);
    return cachedValue.text()!!;
  }
  console.log(`didn't get a hit on first try, attempting set`)
  const setResponse = await cacheClient.set(CACHE_NAME, CACHE_KEY, 'baaaaaaaar');
  console.log(`set response: ${setResponse}`);
  console.log(`back from set, attempting get`)
  return (await cacheClient.get(CACHE_NAME, CACHE_KEY)).text()!!
}

const CACHE_NAME = 'default-cache';
const CACHE_KEY = 'foooooo';

const GLOBAL_AUTH_TOKEN = getEnvVarOrThrowError('MOMENTO_AUTH_TOKEN')
console.log(`CONSTRUCTING CACHE CLIENT`)
const GLOBAL_CACHE_CLIENT = new SimpleCacheClient(GLOBAL_AUTH_TOKEN, 60, {
  requestTimeoutMs: 50_000,
  loggerOptions: {
    level: LogLevel.TRACE
  }
})


const BACKGROUND_LOOP_INTERVAL = 5_000;
let backgroundTaskCounter = 0;

function backgroundLoop() {
  backgroundTaskCounter++
  console.log(`Background task running! Counter is: ${backgroundTaskCounter}`)
  setTimeout(backgroundLoop, BACKGROUND_LOOP_INTERVAL)
}

console.log('Setting up background loop thingy')
backgroundLoop()

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(`EVENT IS: ${JSON.stringify(event, null, 2)}`)
  console.log(`EVENT REQUEST CONTEXT: ${JSON.stringify(context, null ,2)}`)


  //
  // const authToken = getEnvVarOrThrowError('MOMENTO_AUTH_TOKEN')
  // const cacheClient = new SimpleCacheClient(authToken, 60, {requestTimeoutMs: 50_000})

  // const cachedValue = await getCacheValue(cacheClient);
  const cachedValue = await getCacheValue(GLOBAL_CACHE_CLIENT);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Cached value was: ${cachedValue}`,
  };
};
