import {
  ExpiresIn,
  GenerateAuthToken,
  MomentoErrorCode,
  RefreshAuthToken,
} from '@gomomento/sdk-core';
import {IAuthClient} from '@gomomento/sdk-core/dist/src/internal/clients/auth/IAuthClient';

export function runAuthClientTests(authClient: IAuthClient) {
  // skipping test for now until we decide how to feed a session token here
  describe('generate auth token', () => {
    it.skip('should return success and generate auth token', async () => {
      // const sessionToken = process.env.TEST_SESSION_TOKEN as string;
      const resp = await authClient.generateAuthToken(ExpiresIn.seconds(10));
      expect(resp).toBeInstanceOf(GenerateAuthToken.Success);
    });

    it('should succeed for generating an api token that expires', async () => {
      const secondsSinceEpoch = Math.round(Date.now() / 1000);
      const expireResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(10)
      );
      const expiresIn = secondsSinceEpoch + 10;

      expect(expireResponse).toBeInstanceOf(GenerateAuthToken.Success);

      const expireResponseSuccess = expireResponse as GenerateAuthToken.Success;
      expect(expireResponseSuccess.is_success);
      expect(expireResponseSuccess.getExpiresAt().doesExpire());
      expect(expireResponseSuccess.getExpiresAt().epoch()).toBeWithin(
        expiresIn - 1,
        expiresIn + 2
      );
    });

    it('should succeed for generating an api token that never expires', async () => {
      const neverExpiresResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.never()
      );
      expect(neverExpiresResponse).toBeInstanceOf(GenerateAuthToken.Success);
      const neverExpireResponseSuccess =
        neverExpiresResponse as GenerateAuthToken.Success;
      expect(neverExpireResponseSuccess.is_success);
      expect(
        neverExpireResponseSuccess.getExpiresAt().doesExpire()
      ).toBeFalse();
    });

    it('should not succeed for generating an api token that has an invalid expires', async () => {
      const invalidExpiresResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(-100)
      );
      expect(invalidExpiresResponse).toBeInstanceOf(GenerateAuthToken.Error);
      expect(
        (invalidExpiresResponse as GenerateAuthToken.Error).errorCode()
      ).toEqual(MomentoErrorCode.INVALID_ARGUMENT_ERROR);
    });

    it('should not succeed for generating an api token that has an invalid session token', async () => {
      const invalidExpiresResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // 'this is *not* valid',
        ExpiresIn.seconds(60)
      );
      expect(invalidExpiresResponse).toBeInstanceOf(GenerateAuthToken.Error);
      expect(
        (invalidExpiresResponse as GenerateAuthToken.Error).errorCode()
      ).toEqual(MomentoErrorCode.AUTHENTICATION_ERROR);
    });

    it('should succeed for refreshing an api token', async () => {
      const generateResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(10)
      );
      const generateSuccessRst = generateResponse as GenerateAuthToken.Success;

      const refreshResponse = await authClient.refreshAuthToken(
        // CredentialProvider.fromString({
        //   authToken: generateSuccessRst.getAuthToken(),
        // }),
        generateSuccessRst.refreshToken
      );
      expect(refreshResponse).toBeInstanceOf(RefreshAuthToken.Success);
      const refreshSuccessRst = refreshResponse as RefreshAuthToken.Success;

      expect(refreshSuccessRst.is_success);

      expect(generateSuccessRst.getExpiresAt().epoch()).toEqual(
        refreshSuccessRst.getExpiresAt().epoch()
      );
    });

    it("should not succeed for refreshing an api token that's expired", async () => {
      const generateResponse = await authClient.generateAuthToken(
        // controlEndpoint,
        // sessionToken,
        ExpiresIn.seconds(1)
      );
      const generateSuccessRst = generateResponse as GenerateAuthToken.Success;

      // Wait 1sec for the token to expire
      await delay(1000);

      const refreshResponse = await authClient.refreshAuthToken(
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
