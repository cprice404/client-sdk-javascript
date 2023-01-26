import {RetryStrategy} from './retry-strategy';
import {Logger} from '../../utils/logging';
import {StatusObject} from '@grpc/grpc-js';

export class FixedCountRetryStrategy implements RetryStrategy {
  private readonly logger: Logger;
  private readonly maxAttempts: number;

  constructor(maxAttempts: number) {
    this.maxAttempts = maxAttempts;
  }

  determineWhenToRetryRequest<TRequest>(
    grpcStatus: StatusObject,
    grpcRequest: TRequest,
    attemptNumber: number
  ): number | undefined {
    // TODO: implement
    this.logger.debug(
      `Need to determine whether to retry request: ${JSON.stringify(
        grpcStatus
      )}, ${JSON.stringify(grpcRequest)}, ${attemptNumber}`
    );
    return undefined;
  }
}
