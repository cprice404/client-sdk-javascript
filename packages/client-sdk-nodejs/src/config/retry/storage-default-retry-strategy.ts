import {
  DeterminewhenToRetryRequestProps,
  RetryStrategy,
} from './retry-strategy';
import {EligibilityStrategy} from './eligibility-strategy';
import {MomentoLoggerFactory, MomentoLogger} from '../../';
import {DefaultStorageEligibilityStrategy} from './storage-default-eligibility-strategy';
import {Metadata} from '@grpc/grpc-js';

export interface DefaultStorageRetryStrategyProps {
  loggerFactory: MomentoLoggerFactory;
  eligibilityStrategy?: EligibilityStrategy;
  // Retry request after a fixed time interval (defaults to 100ms)
  retryDelayInterval?: number;
}

function metadataToString(metadata: Metadata): string {
  return `THE METADATA KEYS ARE: ${Object.keys(metadata.getMap()).join(', ')}`;
}

export class DefaultStorageRetryStrategy implements RetryStrategy {
  private readonly logger: MomentoLogger;
  private readonly eligibilityStrategy: EligibilityStrategy;
  private readonly retryDelayInterval: number;

  constructor(props: DefaultStorageRetryStrategyProps) {
    this.logger = props.loggerFactory.getLogger(this);
    this.eligibilityStrategy =
      props.eligibilityStrategy ??
      new DefaultStorageEligibilityStrategy(props.loggerFactory);
    this.retryDelayInterval = props.retryDelayInterval ?? 100;
  }

  determineWhenToRetryRequest(
    props: DeterminewhenToRetryRequestProps
  ): number | null {
    this.logger.debug(
      `Determining whether request is eligible for retry; status code: ${props.grpcStatus.code}, request type: ${props.grpcRequest.path}, attemptNumber: ${props.attemptNumber}`
    );
    const metadata = props.grpcStatus.metadata;

    this.logger.debug(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      'DETERMINE WHEN TO RETRY REQUEST; METADATA: %s',
      metadataToString(metadata)
    );

    if (!this.eligibilityStrategy.isEligibleForRetry(props)) {
      // null means do not retry
      return null;
    }
    this.logger.debug(
      `Request is eligible for retry (attempt ${props.attemptNumber}), retrying soon.`
    );
    // retry after a fixed time interval has passed
    return this.retryDelayInterval;
  }
}
