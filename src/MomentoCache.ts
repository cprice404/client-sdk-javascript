import {cache} from '@gomomento/generated-types';
// older versions of node don't have the global util variables https://github.com/nodejs/node/issues/20365
import {TextEncoder} from 'util';
import {Header, HeaderInterceptor} from './grpc/HeadersInterceptor';
import {ClientTimeoutInterceptor} from './grpc/ClientTimeoutInterceptor';
import {CacheGetStatus, momentoResultConverter} from './messages/Result';
import {InvalidArgumentError, UnknownServiceError} from './Errors';
import {cacheServiceErrorMapper} from './CacheServiceErrorMapper';
import {ChannelCredentials, Interceptor} from '@grpc/grpc-js';
import {GetResponse} from './messages/GetResponse';
import {SetResponse} from './messages/SetResponse';
import {version} from '../package.json';
import {DeleteResponse} from './messages/DeleteResponse';
import {createRetryInterceptorIfEnabled} from './grpc/RetryInterceptor';
import {getLogger, Logger, LoggerOptions} from './utils/logging';

/**
 * @property {string} authToken - momento jwt token
 * @property {string} endpoint - endpoint to reach momento cache
 * @property {number} defaultTtlSeconds - the default time to live of object inside of cache, in seconds
 * @property {number} requestTimeoutMs - the amount of time for a request to complete before timing out, in milliseconds
 */
type MomentoCacheProps = {
  authToken: string;
  endpoint: string;
  defaultTtlSeconds: number;
  requestTimeoutMs?: number;
  loggerOptions?: LoggerOptions;
};

export class MomentoCache {
  private static _allInterceptorsExceptHeaderInterceptor: Interceptor[];

  private readonly client: cache.cache_client.ScsClient;
  private readonly textEncoder: TextEncoder;
  private readonly defaultTtlSeconds: number;
  private readonly requestTimeoutMs: number;
  private readonly authToken: string;
  private readonly endpoint: string;
  private static readonly DEFAULT_REQUEST_TIMEOUT_MS: number = 5 * 1000;
  private readonly logger: Logger;
  private readonly loggerOptions: LoggerOptions | undefined;
  // private readonly allInterceptorsExceptHeaderInterceptor: Interceptor[];

  /**
   * @param {MomentoCacheProps} props
   */
  constructor(props: MomentoCacheProps) {
    this.loggerOptions = props.loggerOptions;
    this.logger = getLogger(this, props.loggerOptions);
    this.validateRequestTimeout(props.requestTimeoutMs);
    this.logger.debug(
      `Creating cache client using endpoint: '${props.endpoint}'`
    );
    this.client = new cache.cache_client.ScsClient(
      props.endpoint,
      ChannelCredentials.createSsl(),
      {
        'grpc-node.max_session_memory': 1024,
        'grpc.use_local_subchannel_pool': 1,
        'grpc.max_concurrent_streams': 10_000,
      }
    );
    this.textEncoder = new TextEncoder();
    this.defaultTtlSeconds = props.defaultTtlSeconds;
    this.requestTimeoutMs =
      props.requestTimeoutMs || MomentoCache.DEFAULT_REQUEST_TIMEOUT_MS;
    this.authToken = props.authToken;
    this.endpoint = props.endpoint;
    // The first interceptor in our list is a Header interceptor, which
    // includes a header for the cache name.  The cache name is part of the
    // get/set API calls, so we cannot construct that interceptor here in the
    // constructor; we have to construct it for each request.  Here, we construct
    // all of the other interceptors, which do not vary per request.  It is crucial
    // that we only construct these once and re-use them, because some of them are
    // very heavy-weight (in terms of memory usage, EventEmitter registrations on the
    // `process` object, etc.).
    if (MomentoCache._allInterceptorsExceptHeaderInterceptor === undefined) {
      this.logger.warn('CREATING ALL INTERCEPTORS EXCEPT HEADER INTERCEPTOR');
      MomentoCache._allInterceptorsExceptHeaderInterceptor = [
        ClientTimeoutInterceptor(this.requestTimeoutMs),
        ...createRetryInterceptorIfEnabled({
          requestTimeoutMs: this.requestTimeoutMs,
          loggerOptions: this.loggerOptions,
        }),
      ];
    }
    // console.log(
    //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    //   `STATIC INTERCEPTORS IS CURRENTLY: ${MomentoCache._allInterceptorsExceptHeaderInterceptor}`
    // );
    // throw new Error('derp');
    //
    // if (MomentoCache._allInterceptorsExceptHeaderInterceptor)
    // this.allInterceptorsExceptHeaderInterceptor = [
    //   ClientTimeoutInterceptor(this.requestTimeoutMs),
    //   ...createRetryInterceptorIfEnabled({
    //     loggerOptions: this.loggerOptions,
    //   }),
    // ];
  }

  public getEndpoint(): string {
    this.logger.debug(`Using cache endpoint: ${this.endpoint}`);
    return this.endpoint;
  }

  private validateRequestTimeout(timeout?: number) {
    this.logger.debug(`Request timeout: ${this.endpoint}`);
    if (timeout && timeout <= 0) {
      throw new InvalidArgumentError(
        'request timeout must be greater than zero.'
      );
    }
  }

  public async set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    ttl?: number
  ): Promise<SetResponse> {
    this.ensureValidSetRequest(key, value, ttl || this.defaultTtlSeconds);
    this.logger.trace(
      `Issuing 'set' request; key: ${key.toString()}, value length: ${
        value.length
      }, ttl: ${ttl?.toString() ?? 'null'}`
    );
    const encodedKey = this.convert(key);
    const encodedValue = this.convert(value);

    return await this.sendSet(
      cacheName,
      encodedKey,
      encodedValue,
      ttl || this.defaultTtlSeconds
    );
  }

  private async sendSet(
    cacheName: string,
    key: Uint8Array,
    value: Uint8Array,
    ttl: number
  ): Promise<SetResponse> {
    const request = new cache.cache_client._SetRequest({
      cache_body: value,
      cache_key: key,
      ttl_milliseconds: ttl * 1000,
    });
    return await new Promise((resolve, reject) => {
      this.client.Set(
        request,
        {
          interceptors: this.getInterceptors(cacheName),
        },
        (err, resp) => {
          if (resp) {
            resolve(this.parseSetResponse(resp, value));
          } else {
            reject(cacheServiceErrorMapper(err));
          }
        }
      );
    });
  }

  public async delete(
    cacheName: string,
    key: string | Uint8Array
  ): Promise<DeleteResponse> {
    this.ensureValidKey(key);
    this.logger.trace(`Issuing 'delete' request; key: ${key.toString()}`);
    return await this.sendDelete(cacheName, this.convert(key));
  }

  private async sendDelete(
    cacheName: string,
    key: Uint8Array
  ): Promise<DeleteResponse> {
    const request = new cache.cache_client._DeleteRequest({
      cache_key: key,
    });
    return await new Promise((resolve, reject) => {
      this.client.Delete(
        request,
        {
          interceptors: this.getInterceptors(cacheName),
        },
        (err, resp) => {
          if (resp) {
            resolve(new DeleteResponse());
          } else {
            reject(cacheServiceErrorMapper(err));
          }
        }
      );
    });
  }

  public async get(
    cacheName: string,
    key: string | Uint8Array
  ): Promise<GetResponse> {
    this.ensureValidKey(key);
    this.logger.trace(`Issuing 'get' request; key: ${key.toString()}`);
    const result = await this.sendGet(cacheName, this.convert(key));
    this.logger.trace(`'get' request result: ${result.status}`);
    return result;
  }

  private async sendGet(
    cacheName: string,
    key: Uint8Array
  ): Promise<GetResponse> {
    const request = new cache.cache_client._GetRequest({
      cache_key: key,
    });

    return await new Promise((resolve, reject) => {
      this.client.Get(
        request,
        {
          interceptors: this.getInterceptors(cacheName),
        },
        (err, resp) => {
          if (resp) {
            const momentoResult = momentoResultConverter(resp.result);
            if (
              momentoResult !== CacheGetStatus.Miss &&
              momentoResult !== CacheGetStatus.Hit
            ) {
              reject(new UnknownServiceError(resp.message));
            }
            resolve(this.parseGetResponse(resp));
          } else {
            reject(cacheServiceErrorMapper(err));
          }
        }
      );
    });
  }

  private parseGetResponse = (
    resp: cache.cache_client._GetResponse
  ): GetResponse => {
    const momentoResult = momentoResultConverter(resp.result);
    return new GetResponse(momentoResult, resp.message, resp.cache_body);
  };

  private parseSetResponse = (
    resp: cache.cache_client._SetResponse,
    value: Uint8Array
  ): SetResponse => {
    return new SetResponse(resp.message, value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ensureValidKey = (key: any) => {
    if (!key) {
      throw new InvalidArgumentError('key must not be empty');
    }
  };

  private getInterceptors(cacheName: string): Interceptor[] {
    const headers = [
      new Header('Authorization', this.authToken),
      new Header('cache', cacheName),
      new Header('Agent', `javascript:${version}`),
    ];
    return [
      new HeaderInterceptor(headers).addHeadersInterceptor(),
      ...MomentoCache._allInterceptorsExceptHeaderInterceptor,
    ];
  }

  private convert(v: string | Uint8Array): Uint8Array {
    if (typeof v === 'string') {
      return this.textEncoder.encode(v);
    }
    return v;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ensureValidSetRequest(key: any, value: any, ttl: number) {
    this.ensureValidKey(key);

    if (!value) {
      throw new InvalidArgumentError('value must not be empty');
    }

    if (ttl && ttl < 0) {
      throw new InvalidArgumentError('ttl must be a positive integer');
    }
  }
}
