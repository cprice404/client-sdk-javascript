import {StatusObject} from '@grpc/grpc-js';

export interface RetryStrategy {
  determineWhenToRetryRequest<TRequest>(
    grpcStatus: StatusObject,
    grpcRequest: TRequest,
    attemptNumber: number
  ): number | undefined;
}
