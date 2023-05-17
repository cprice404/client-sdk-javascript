import {runAuthClientTests} from '@gomomento/common-integration-tests';
import {SetupAuthClientIntegrationTest} from '../integration-setup';

const {authClient} = SetupAuthClientIntegrationTest();

runAuthClientTests(authClient);
