import {Metadata, StatusObject} from '@grpc/grpc-js';

// export interface MiddlewareResponseState {
//   something: string;
//   // public record struct MiddlewareResponseState<TResponse>(
//   //   Task<TResponse> ResponseAsync,
//   // Task<Metadata> ResponseHeadersAsync,
//   // Func<Status> GetStatus,
//   // Func<Metadata> GetTrailers
//   // );
// }
export interface MiddlewareRequestHandler {
  onRequestMetadata(metadata: Metadata): Promise<Metadata>;
  onRequestBody(request: any): Promise<any>;

  onResponseMetadata(metadata: Metadata): Promise<Metadata>;
  onResponseBody(response: any): Promise<any>;
  onResponseStatus(status: StatusObject): Promise<StatusObject>;
}

/**
 * The Middleware interface allows the Configuration to provide a higher-order function that wraps all requests.
 * This allows future support for things like client-side metrics or other diagnostics helpers.
 */
export interface Middleware {
  onNewRequest(): MiddlewareRequestHandler;
}

// wrapRequest(
//   request: string,
//   callOptions: string,
//   continuation: (
//     request: string,
//     callOptions: string,
//     responseState: MiddlewareResponseState
//   ) => Promise<MiddlewareResponseState>
// ): Promise<MiddlewareResponseState>;
//

// wrapRequest(
//   metadata: Metadata,
//   request: any,
//   continuation: (
//     metadata: Metadata,
//     request: any
//   ) => Promise<
//     (status: StatusObject, metadata: Metadata, response: any) => void
//   >
// ): Promise<(status: StatusObject, metadata: Metadata, response: any) => void>;

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
// }
