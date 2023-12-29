import {Status} from '@grpc/grpc-js/build/src/constants';
import {ServiceError} from '@grpc/grpc-js';
import {
  NotFoundError,
  InternalServerError,
  InvalidArgumentError,
  PermissionError,
  BadRequestError,
  CancelledError,
  TimeoutError,
  AuthenticationError,
  LimitExceededError,
  AlreadyExistsError,
  SdkError,
  UnknownServiceError,
  ServerUnavailableError,
  UnknownError,
  FailedPreconditionError,
} from '../../src';

export class CacheServiceErrorMapper {
  private readonly throwOnError: boolean;

  constructor(throwOnError: boolean) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`CONSTRUCTING CACHE SERVICE ERROR MAPPER: ${throwOnError}`);
    this.throwOnError = throwOnError;
  }
  mapError(err: ServiceError | null): SdkError {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`MAPPING ERROR!!! ${err}`);

    const errParams: [
      string,
      number | undefined,
      object | undefined,
      string | undefined
    ] = [
      err?.message || 'Unable to process request',
      err?.code,
      err?.metadata,
      err?.stack,
    ];
    let error: SdkError;
    switch (err?.code) {
      case Status.PERMISSION_DENIED:
        error = new PermissionError(...errParams);
        break;
      case Status.DATA_LOSS:
      case Status.INTERNAL:
      case Status.ABORTED:
        error = new InternalServerError(...errParams);
        break;
      case Status.UNKNOWN:
        error = new UnknownServiceError(...errParams);
        break;
      case Status.UNAVAILABLE:
        error = new ServerUnavailableError(...errParams);
        break;
      case Status.NOT_FOUND:
        error = new NotFoundError(...errParams);
        break;
      case Status.OUT_OF_RANGE:
      case Status.UNIMPLEMENTED:
        error = new BadRequestError(...errParams);
        break;
      case Status.FAILED_PRECONDITION:
        error = new FailedPreconditionError(...errParams);
        break;
      case Status.INVALID_ARGUMENT:
        error = new InvalidArgumentError(...errParams);
        break;
      case Status.CANCELLED:
        error = new CancelledError(...errParams);
        break;
      case Status.DEADLINE_EXCEEDED:
        error = new TimeoutError(...errParams);
        break;
      case Status.UNAUTHENTICATED:
        error = new AuthenticationError(...errParams);
        break;
      case Status.RESOURCE_EXHAUSTED:
        error = new LimitExceededError(...errParams);
        break;
      case Status.ALREADY_EXISTS:
        error = new AlreadyExistsError(...errParams);
        break;
      default:
        error = new UnknownError(...errParams);
        break;
    }
    if (this.throwOnError) {
      console.log(`THROWING ERROR: ${error.toString()}`);
      throw error;
    }
    return error;
  }
}
