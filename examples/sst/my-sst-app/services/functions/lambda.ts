import {APIGatewayProxyHandlerV2} from "aws-lambda";
import {CacheGetStatus, SimpleCacheClient} from "./momento";


function getEnvVarOrThrowError(envVarName: string): string {
  const result = process.env[envVarName];
  if (result === undefined) {
    throw new Error(`Missing required env var: ${envVarName}`)
  }
  return result;
}

async function getCacheValue(cacheClient: SimpleCacheClient): string {
  const cachedValue = await cacheClient.get(CACHE_NAME, CACHE_KEY);
  if (cachedValue.status === CacheGetStatus.Hit) {
    return cachedValue.text()!!;
  }
  await cacheClient.set(CACHE_NAME, CACHE_KEY, 'baaaaaaaar');
  return (await cacheClient.get(CACHE_NAME, CACHE_KEY)).text()!!
}

const CACHE_NAME = 'default-cache';
const CACHE_KEY = 'foooooo';

const GLOBAL_AUTH_TOKEN = getEnvVarOrThrowError('MOMENTO_AUTH_TOKEN')
const GLOBAL_CACHE_CLIENT = new SimpleCacheClient(GLOBAL_AUTH_TOKEN, 60, {requestTimeoutMs: 50_000})

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
