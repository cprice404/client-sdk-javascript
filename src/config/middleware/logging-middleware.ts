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
import {Middleware, MiddlewareResponseState} from './middleware';

export class LoggingMiddleware implements Middleware {
  private readonly logger: MomentoLogger;
  constructor(loggerFactory: MomentoLoggerFactory) {
    this.logger = loggerFactory.getLogger(this);
  }

  wrapRequest(
    request: string,
    callOptions: string,
    continuation: (
      request: string,
      callOptions: string,
      responseState: MiddlewareResponseState
    ) => Promise<MiddlewareResponseState>
  ): Promise<MiddlewareResponseState> {
    this.logger.debug('Executing request of type: %s', request);
    throw new Error('Not yet implemented');
  }
}
