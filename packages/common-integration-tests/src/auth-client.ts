import {
  ExpiresIn,
  GenerateAuthToken,
  MomentoErrorCode,
  RefreshAuthToken,
} from '@gomomento/sdk-core';
import {IAuthClient} from '@gomomento/sdk-core/dist/src/internal/clients/auth/IAuthClient';
import {expectWithMessage} from './common-int-test-utils';

export function runAuthClientTests(
  sessionTokenAuthClient: IAuthClient,
  authTokenAuthClientFactory: (authToken: string) => IAuthClient
) {
  describe('generate auth token using session token credentials', () => {
    it('should return success and generate auth token', async () => {
      const resp = await sessionTokenAuthClient.generateAuthToken(
        ExpiresIn.seconds(10)
      );
      expectWithMessage(
        () => expect(resp).toBeInstanceOf(GenerateAuthToken.Success),
        `Unexpected response: ${resp.toString()}`
      );
    });

    it('should succeed for generating an api token that expires', async () => {
      const secondsSinceEpoch = Math.round(Date.now() / 1000);
      const expireResponse = await sessionTokenAuthClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(10)
      );
      const expiresIn = secondsSinceEpoch + 10;

      expect(expireResponse).toBeInstanceOf(GenerateAuthToken.Success);

      const expireResponseSuccess = expireResponse as GenerateAuthToken.Success;
      expect(expireResponseSuccess.is_success);
      expect(expireResponseSuccess.expiresAt.doesExpire());
      expect(expireResponseSuccess.expiresAt.epoch()).toBeWithin(
        expiresIn - 1,
        expiresIn + 2
      );
    });

    it('should succeed for generating an api token that never expires', async () => {
      const neverExpiresResponse =
        await sessionTokenAuthClient.generateAuthToken(
          // controlEndpoint,
          // sessionToken,
          ExpiresIn.never()
        );
      expect(neverExpiresResponse).toBeInstanceOf(GenerateAuthToken.Success);
      const neverExpireResponseSuccess =
        neverExpiresResponse as GenerateAuthToken.Success;
      expect(neverExpireResponseSuccess.is_success);
      expect(neverExpireResponseSuccess.expiresAt.doesExpire()).toBeFalse();
    });

    it('should not succeed for generating an api token that has an invalid expires', async () => {
      const invalidExpiresResponse =
        await sessionTokenAuthClient.generateAuthToken(
          // controlEndpoint,
          // sessionToken,
          ExpiresIn.seconds(-100)
        );
      expect(invalidExpiresResponse).toBeInstanceOf(GenerateAuthToken.Error);
      expect(
        (invalidExpiresResponse as GenerateAuthToken.Error).errorCode()
      ).toEqual(MomentoErrorCode.INVALID_ARGUMENT_ERROR);
    });
  });

  describe('refresh auth token use auth token credentials', () => {
    it('should succeed for refreshing an auth token', async () => {
      console.log('gh95');
      const generateResponse = await sessionTokenAuthClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(10)
      );
      console.log('gh96');
      const generateSuccessRst = generateResponse as GenerateAuthToken.Success;

      console.log('gh97');
      const authTokenAuthClient = authTokenAuthClientFactory(
        generateSuccessRst.authToken
      );
      console.log('gh98');
      const refreshResponse = await authTokenAuthClient.refreshAuthToken(
        // CredentialProvider.fromString({
        //   authToken: generateSuccessRst.getAuthToken(),
        // }),
        generateSuccessRst.refreshToken
      );
      console.log('gh99');
      expectWithMessage(() => {
        expect(refreshResponse).toBeInstanceOf(RefreshAuthToken.Success);
      }, `Unexpected response: ${refreshResponse.toString()}`);
      const refreshSuccessRst = refreshResponse as RefreshAuthToken.Success;

      console.log('FOOOOOOOOO');
      expect(refreshSuccessRst.is_success);

      console.log('gh100');
      expect(generateSuccessRst.expiresAt.epoch()).toEqual(
        refreshSuccessRst.getExpiresAt().epoch()
      );
    });

    it("should not succeed for refreshing an api token that's expired", async () => {
      const generateResponse = await sessionTokenAuthClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(1)
      );
      const generateSuccessRst = generateResponse as GenerateAuthToken.Success;

      // Wait 1sec for the token to expire
      await delay(1000);

      const authTokenAuthClient = authTokenAuthClientFactory(
        generateSuccessRst.authToken
      );

      const refreshResponse = await authTokenAuthClient.refreshAuthToken(
        // CredentialProvider.fromString({
        //   authToken: generateSuccessRst.getAuthToken(),
        // }),
        generateSuccessRst.refreshToken
      );
      expect(refreshResponse).toBeInstanceOf(RefreshAuthToken.Error);
      expect((refreshResponse as RefreshAuthToken.Error).errorCode()).toEqual(
        MomentoErrorCode.AUTHENTICATION_ERROR
      );
    });
  });
}

export function delay(ms: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
