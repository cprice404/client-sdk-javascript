import {auth} from '@gomomento/generated-types-webtext';
import {GenerateAuthToken, RefreshAuthToken} from '..';
import {version} from '../../package.json';
import {Request, UnaryInterceptor, UnaryResponse} from 'grpc-web';
import {Header, HeaderInterceptorProvider} from './grpc/headers-interceptor';
import {
  _GenerateApiTokenRequest,
  _RefreshApiTokenRequest,
} from '@gomomento/generated-types-webtext/dist/auth_pb';
import {cacheServiceErrorMapper} from '../errors/cache-service-error-mapper';
import Never = _GenerateApiTokenRequest.Never;
import Expires = _GenerateApiTokenRequest.Expires;
import {CredentialProvider, ExpiresAt, ExpiresIn} from '@gomomento/sdk-core';
import {IAuthClient} from '@gomomento/sdk-core/dist/src/internal/clients';
import {AuthClientProps} from '../auth-client-props';
import {validateValidForSeconds} from '@gomomento/sdk-core/dist/src/internal/utils';
import {normalizeSdkError} from '@gomomento/sdk-core/dist/src/errors';
// import exp = require('constants');

export class InternalWebGrpcAuthClient<
  REQ extends Request<REQ, RESP>,
  RESP extends UnaryResponse<REQ, RESP>
> implements IAuthClient
{
  private readonly creds: CredentialProvider;
  private readonly interceptors: UnaryInterceptor<REQ, RESP>[];

  constructor(props: AuthClientProps) {
    this.creds = props.credentialProvider;
    const headers = [new Header('Agent', `nodejs:${version}`)];

    this.interceptors = [
      new HeaderInterceptorProvider<REQ, RESP>(
        headers
      ).createHeadersInterceptor(),
    ];
  }

  public async generateAuthToken(
    // controlEndpoint: string,
    // token: string,
    expiresIn: ExpiresIn
  ): Promise<GenerateAuthToken.Response> {
    // const request = new _GenerateApiTokenRequest();
    // request.setSessionToken(this.creds.getAuthToken());
    // if (expiresIn.doesExpire()) {
    //   request.setExpires(new Expires().setValidForSeconds(expiresIn.seconds()));
    // } else {
    //   request.setNever(new Never());
    // }
    // const clientAuthWrapper = new auth.AuthClient(
    //   `https://${this.creds.getControlEndpoint()}`,
    //   null,
    //   {
    //     unaryInterceptors: this.interceptors,
    //   }
    // );
    // return await new Promise<GenerateAuthToken.Response>(resolve => {
    //   clientAuthWrapper.generateApiToken(request, null, (err, resp) => {
    //     if (err) {
    //       resolve(new GenerateAuthToken.Error(cacheServiceErrorMapper(err)));
    //     } else {
    //       resolve(
    //         new GenerateAuthToken.Success(
    //           resp.getApiKey(),
    //           resp.getRefreshToken(),
    //           resp.getEndpoint(),
    //           ExpiresAt.fromEpoch(resp.getValidUntil())
    //         )
    //       );
    //     }
    //   });
    // });

    console.log(
      `GENERATE AUTH TOKEN, CREDS: ${JSON.stringify(this.creds, null, 2)}`
    );
    const authClient = new auth.AuthClient(
      `https://${this.creds.getControlEndpoint()}`,
      null,
      {
        unaryInterceptors: this.interceptors,
      }
    );

    const request = new _GenerateApiTokenRequest();
    request.setSessionToken(this.creds.getAuthToken());

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `GENERATE AUTH TOKEN: DOES THE PASSED-IN EXPIRESIN EXPIRE? ${expiresIn.doesExpire()}`
    );

    if (expiresIn.doesExpire()) {
      try {
        validateValidForSeconds(expiresIn.seconds());
      } catch (err) {
        return new GenerateAuthToken.Error(normalizeSdkError(err as Error));
      }

      const grpcExpires = new Expires();
      grpcExpires.setValidForSeconds(expiresIn.seconds());
      request.setExpires(grpcExpires);
    } else {
      request.setNever(new Never());
    }

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `HERE IS THE FINAL REQUEST: expires: ${request.getExpires()}, never: ${request.getNever()}`
    );

    return await new Promise<GenerateAuthToken.Response>(resolve => {
      authClient.generateApiToken(request, null, (err, resp) => {
        if (err || !resp) {
          resolve(new GenerateAuthToken.Error(cacheServiceErrorMapper(err)));
        } else {
          console.log(`GOT A RESPONSE; VALID UNTIL: ${resp.getValidUntil()}`);
          resolve(
            new GenerateAuthToken.Success(
              resp.getApiKey(),
              resp.getRefreshToken(),
              resp.getEndpoint(),
              ExpiresAt.fromEpoch(resp.getValidUntil())
            )
          );
        }
      });
    });
  }

  public async refreshAuthToken(
    // _credentialProvider: CredentialProvider,
    _refreshToken: string
  ): Promise<RefreshAuthToken.Response> {
    const authClient = new auth.AuthClient(
      `https://${this.creds.getControlEndpoint()}`,
      null,
      {
        unaryInterceptors: this.interceptors,
      }
    );

    const request = new _RefreshApiTokenRequest();
    request.setApiKey(this.creds.getAuthToken());
    request.setRefreshToken(_refreshToken);

    return await new Promise<RefreshAuthToken.Response>(resolve => {
      authClient.refreshApiToken(request, null, (err, resp) => {
        if (err || !resp) {
          resolve(new RefreshAuthToken.Error(cacheServiceErrorMapper(err)));
        } else {
          resolve(
            new RefreshAuthToken.Success(
              resp.getApiKey(),
              resp.getRefreshToken(),
              resp.getEndpoint(),
              ExpiresAt.fromEpoch(resp.getValidUntil())
            )
          );
        }
      });
    });
  }
}
