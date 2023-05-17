import {
  // CredentialProvider,
  ExpiresIn,
  GenerateAuthToken,
  RefreshAuthToken,
} from '../../../index';

export interface IAuthClient {
  generateAuthToken(
    // controlEndpoint: string,
    // token: string,
    expiresIn: ExpiresIn
  ): Promise<GenerateAuthToken.Response>;

  refreshAuthToken(
    // credentialProvider: CredentialProvider,
    refreshToken: string
  ): Promise<RefreshAuthToken.Response>;
}
