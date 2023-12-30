import {runGetSetDeleteTests} from '@gomomento/common-integration-tests';
import {SetupIntegrationTest} from '../integration-setup';

console.log('RUNNING GET SET DELETE TESTS!');

const {cacheClient, cacheClientWithThrowOnErrors, integrationTestCacheName} =
  SetupIntegrationTest();

runGetSetDeleteTests(
  cacheClient,
  cacheClientWithThrowOnErrors,
  integrationTestCacheName
);
