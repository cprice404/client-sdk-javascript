import {RetryStrategy} from './retry-strategy';
import {Logger} from '../../utils/logging';

export class FixedCountRetryStrategy implements RetryStrategy {
  private readonly logger: Logger;
  private readonly maxAttempts: number;

  constructor(maxAttempts: number) {
    this.maxAttempts = maxAttempts;
  }

  determineWhenToRetryRequest<TRequest>(
    grpcStatus: boolean,
    grpcRequest: TRequest,
    attemptNumber: number
  ): number | undefined {
    // TODO: implement
    return undefined;
  }
}
