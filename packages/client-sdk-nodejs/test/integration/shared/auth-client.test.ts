import {SetupAuthIntegrationTest} from '../integration-setup';
import {runAuthClientTests} from '@gomomento/common-integration-tests';

// const {authClient, sessionToken, controlEndpoint} = SetupAuthIntegrationTest();
const {authClient} = SetupAuthIntegrationTest();

runAuthClientTests(authClient);
