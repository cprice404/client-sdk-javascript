export interface MiddlewareResponseState {
  something: string;
  // public record struct MiddlewareResponseState<TResponse>(
  //   Task<TResponse> ResponseAsync,
  // Task<Metadata> ResponseHeadersAsync,
  // Func<Status> GetStatus,
  // Func<Metadata> GetTrailers
  // );
}

/**
 * The Middleware interface allows the Configuration to provide a higher-order function that wraps all requests.
 * This allows future support for things like client-side metrics or other diagnostics helpers.
 */
export interface Middleware {
  wrapRequest(
    request: string,
    callOptions: string,
    continuation: (
      request: string,
      callOptions: string,
      responseState: MiddlewareResponseState
    ) => Promise<MiddlewareResponseState>
  ): Promise<MiddlewareResponseState>;
  /// <summary>
  /// Called as a wrapper around each request; can be used to time the request and collect metrics etc.
  /// </summary>
  /// <typeparam name="TRequest"></typeparam>
  /// <typeparam name="TResponse"></typeparam>
  /// <param name="request"></param>
  /// <param name="callOptions"></param>
  /// <param name="continuation"></param>
  /// <returns></returns>
  ///
  // public Task<MiddlewareResponseState<TResponse>> WrapRequest<TRequest, TResponse>(
  //   TRequest request,
  // CallOptions callOptions,
  // Func<TRequest, CallOptions, Task<MiddlewareResponseState<TResponse>>> continuation
  // ) where TRequest : class where TResponse: class;
}
