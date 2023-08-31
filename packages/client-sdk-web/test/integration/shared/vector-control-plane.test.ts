import {runVectorControlPlaneTest} from '@gomomento/common-integration-tests';
import {SetupVectorIntegrationTest} from '../integration-setup';

const {Momento} = SetupVectorIntegrationTest();

runVectorControlPlaneTest(Momento);
