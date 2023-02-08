/*
public LoggingMiddleware(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<LoggingMiddleware>();
        }

        /// <inheritdoc/>
        public async Task<MiddlewareResponseState<TResponse>> WrapRequest<TRequest, TResponse>(
            TRequest request,
            CallOptions callOptions,
            Func<TRequest, CallOptions, Task<MiddlewareResponseState<TResponse>>> continuation
        ) where TRequest : class where TResponse : class
        {
            _logger.LogDebug("Executing request of type: {}", request.GetType());
            var nextState = await continuation(request, callOptions);
            return new MiddlewareResponseState<TResponse>(
                ResponseAsync: nextState.ResponseAsync.ContinueWith(r =>
                {
                    _logger.LogDebug("Got response for request of type: {}", request.GetType());
                    return r.Result;
                }),
                ResponseHeadersAsync: nextState.ResponseHeadersAsync,
                GetStatus: nextState.GetStatus,
                GetTrailers: nextState.GetTrailers
            );
        }
    }
 */

import {MomentoLogger, MomentoLoggerFactory} from '../logging/momento-logger';
import {Middleware, MiddlewareRequestHandler} from './middleware';
import {Metadata, StatusObject} from '@grpc/grpc-js';

export class LoggingMiddlewareRequestHandler
  implements MiddlewareRequestHandler
{
  private readonly logger: MomentoLogger;
  constructor(logger: MomentoLogger) {
    this.logger = logger;
  }

  onRequestMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.info(
      'Logging middleware: onRequestMetadata: %s',
      JSON.stringify(metadata.toJSON())
    );
    return Promise.resolve(metadata);
  }
  onRequestBody(request: any): Promise<any> {
    this.logger.info(
      'Logging middleware: onRequestBody: request type: %s',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.constructor.name
    );
    return Promise.resolve(request);
  }

  onResponseMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.info(
      'Logging middleware: onResponseMetadata: %s',
      JSON.stringify(metadata.toJSON())
    );
    return Promise.resolve(metadata);
  }

  onResponseBody(response: any): Promise<any> {
    this.logger.info(
      'Logging middleware: onResponseBody: response type: %s',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      response.constructor.name
    );
    return Promise.resolve(response);
  }

  onResponseStatus(status: StatusObject): Promise<StatusObject> {
    this.logger.info(
      'Logging middleware: onResponseStatus: status code: %s',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      status.code
    );
    return Promise.resolve(status);
  }
}

export class LoggingMiddleware implements Middleware {
  private readonly logger: MomentoLogger;
  constructor(loggerFactory: MomentoLoggerFactory) {
    this.logger = loggerFactory.getLogger(this);
  }

  onNewRequest(): MiddlewareRequestHandler {
    this.logger.warn('LOGGING MIDDLEWARE.onNewRequest');
    return new LoggingMiddlewareRequestHandler(this.logger);
  }
  //
  // wrapRequest(
  //   request: string,
  //   callOptions: string,
  //   continuation: (
  //     request: string,
  //     callOptions: string,
  //     responseState: MiddlewareResponseState
  //   ) => Promise<MiddlewareResponseState>
  // ): Promise<MiddlewareResponseState> {
  //   this.logger.debug('Executing request of type: %s', request);
  //   throw new Error('Not yet implemented');
  // }

  // wrapRequest(
  //   metadata: Metadata,
  //   request: any,
  //   continuation: (
  //     metadata: Metadata,
  //     request: any
  //   ) => Promise<
  //     (status: StatusObject, metadata: Metadata, response: any) => void
  //   >
  // ): Promise<
  //   (status: StatusObject, metadata: Metadata, response: any) => void
  // > {
  //   this.logger.debug('Executing request of type: %s', request);
  //   throw new Error('Not yet implemented');
  // }
}
