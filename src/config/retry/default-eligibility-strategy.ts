import {Status} from '@grpc/grpc-js/build/src/constants';
import {
  EligibilityStrategy,
  EligibleForRetryProps,
} from './eligibility-strategy';
import {getLogger, Logger} from '../../utils/logging';

const retryableGrpcStatusCodes: Array<Status> = [
  // including all the status codes for reference, but
  // commenting out the ones we don't want to retry on for now.

  // Status.OK,
  // Status.CANCELLED,
  // Status.UNKNOWN,
  // Status.INVALID_ARGUMENT,
  // Status.DEADLINE_EXCEEDED,
  // Status.NOT_FOUND,
  // Status.ALREADY_EXISTS,
  // Status.PERMISSION_DENIED,
  // Status.RESOURCE_EXHAUSTED,
  Status.FAILED_PRECONDITION,
  // Status.ABORTED,
  // Status.OUT_OF_RANGE,
  // Status.UNIMPLEMENTED,
  Status.INTERNAL,
  Status.UNAVAILABLE,
  // Status.DATA_LOSS,
  // Status.UNAUTHENTICATED
];

const retryableRequestTypes: Array<string> = [];

//
// private readonly HashSet<Type> _retryableRequestTypes = new HashSet<Type>
//   {
//     typeof(_SetRequest),
//     typeof(_GetRequest),
//     typeof(_DeleteRequest),
//     typeof(_DictionarySetRequest),
//     // not idempotent: typeof(_DictionaryIncrementRequest),
//     typeof(_DictionaryGetRequest),
//     typeof(_DictionaryFetchRequest),
//     typeof(_DictionaryDeleteRequest),
//     typeof(_SetUnionRequest),
//     typeof(_SetDifferenceRequest),
//     typeof(_SetFetchRequest),
//     // not idempotent: typeof(_ListPushFrontRequest),
//     // not idempotent: typeof(_ListPushBackRequest),
//     // not idempotent: typeof(_ListPopFrontRequest),
//     // not idempotent: typeof(_ListPopBackRequest),
//     typeof(_ListFetchRequest),
//     /*
//      *  Warning: in the future, this may not be idempotent
//      *  Currently it supports removing all occurrences of a value.
//      *  In the future, we may also add "the first/last N occurrences of a value".
//      *  In the latter case it is not idempotent.
//      */
//     typeof(_ListRemoveRequest),
//     typeof(_ListLengthRequest),
//     // not idempotent: typeof(_ListConcatenateFrontRequest),
//     // not idempotent: typeof(_ListConcatenateBackRequest)
//   };

export class DefaultEligibilityStrategy implements EligibilityStrategy {
  private readonly logger: Logger;

  constructor() {
    this.logger = getLogger(this);
  }

  isEligibleForRetry(props: EligibleForRetryProps): boolean {
    /*
    if (!_retryableStatusCodes.Contains(status.StatusCode))
            {
                _logger.LogDebug("Response with status code {} is not retryable.", status.StatusCode);
                return false;
            }

            if (!_retryableRequestTypes.Contains(request.GetType()))
            {
                _logger.LogDebug("Request with type {} is not retryable.", request.GetType());
                return false;
            }

            return true;
     */

    if (!retryableGrpcStatusCodes.includes(props.grpcStatus.code)) {
      this.logger.debug(
        `Response with status code ${props.grpcStatus.code} is not retryable.`
      );
      return false;
    }

    if (!retryableRequestTypes.includes(props.grpcRequest.path)) {
      this.logger.debug(
        `Request with type ${props.grpcRequest.path} is not retryable.`
      );
      return false;
    }

    return true;
  }
}
