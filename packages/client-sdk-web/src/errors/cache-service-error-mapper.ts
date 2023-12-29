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
import {RpcError, StatusCode} from 'grpc-web';

export class CacheServiceErrorMapper {
  private readonly throwOnErrors: boolean;

  constructor(throwOnErrors: boolean) {
    this.throwOnErrors = throwOnErrors;
  }

  mapError(err: RpcError | null): SdkError {
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
      case StatusCode.PERMISSION_DENIED:
        error = new PermissionError(...errParams);
        break;
      case StatusCode.DATA_LOSS:
      case StatusCode.INTERNAL:
      case StatusCode.ABORTED:
        error = new InternalServerError(...errParams);
        break;
      case StatusCode.UNKNOWN:
        error = new UnknownServiceError(...errParams);
        break;
      case StatusCode.UNAVAILABLE:
        error = new ServerUnavailableError(...errParams);
        break;
      case StatusCode.NOT_FOUND:
        error = new NotFoundError(...errParams);
        break;
      case StatusCode.OUT_OF_RANGE:
      case StatusCode.UNIMPLEMENTED:
        error = new BadRequestError(...errParams);
        break;
      case StatusCode.FAILED_PRECONDITION:
        error = new FailedPreconditionError(...errParams);
        break;
      case StatusCode.INVALID_ARGUMENT:
        error = new InvalidArgumentError(...errParams);
        break;
      case StatusCode.CANCELLED:
        error = new CancelledError(...errParams);
        break;
      case StatusCode.DEADLINE_EXCEEDED:
        error = new TimeoutError(...errParams);
        break;
      case StatusCode.UNAUTHENTICATED:
        error = new AuthenticationError(...errParams);
        break;
      case StatusCode.RESOURCE_EXHAUSTED:
        error = new LimitExceededError(...errParams);
        break;
      case StatusCode.ALREADY_EXISTS:
        error = new AlreadyExistsError(...errParams);
        break;
      default:
        error = new UnknownError(...errParams);
        break;
    }
    if (this.throwOnErrors) {
      throw error;
    }
    return error;
  }
}
