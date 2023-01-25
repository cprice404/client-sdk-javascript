import {StatusObject} from '@grpc/grpc-js';

export interface RetryStrategy {
  determineWhenToRetryRequest<TRequest>(
    grpcStatus: StatusObject,
    grpcRequest: TRequest,
    attemptNumber: number
  ): number | undefined;
}

/*
// <summary>
/// Defines a contract for how and when to retry a request
/// </summary>
public interface IRetryStrategy
{
    /// <summary>
    /// Calculates whether or not to retry a request based on the type of request and number of attempts.
    /// </summary>
    /// <param name="grpcStatus"></param>
    /// <param name="grpcRequest"></param>
    /// <param name="attemptNumber"></param>
    /// <returns>Returns number of milliseconds after which the request should be retried, or <see langword="null"/> if the request should not be retried.</returns>
    public int? DetermineWhenToRetryRequest<TRequest>(Status grpcStatus, TRequest grpcRequest, int attemptNumber) where TRequest : class;
}
 */
