import {MomentoLogger, MomentoLoggerFactory} from '../logging/momento-logger';
import {Middleware, MiddlewareRequestHandler} from './middleware';
import {Metadata, StatusObject} from '@grpc/grpc-js';
import {Message} from 'google-protobuf';

export class LoggingMiddlewareRequestHandler
  implements MiddlewareRequestHandler
{
  private readonly logger: MomentoLogger;
  private readonly requestId: string;
  constructor(logger: MomentoLogger, requestId: string) {
    this.logger = logger;
    this.requestId = requestId;
  }

  onRequestMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.debug(
      'Logging middleware: request %s onRequestMetadata: %s',
      this.requestId,
      JSON.stringify(metadata.toJSON())
    );
    return Promise.resolve(metadata);
  }
  onRequestBody(request: Message): Promise<Message> {
    this.logger.debug(
      'Logging middleware: request %s onRequestBody: request type: %s, request size: %s',
      this.requestId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.constructor.name,
      request.serializeBinary().length
    );
    return Promise.resolve(request);
  }

  onResponseMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.debug(
      'Logging middleware: request %s onResponseMetadata: %s',
      this.requestId,
      JSON.stringify(metadata.toJSON())
    );
    return Promise.resolve(metadata);
  }

  onResponseBody(response: Message): Promise<Message> {
    this.logger.debug(
      'Logging middleware: request %s onResponseBody: response type: %s, response size: %s',
      this.requestId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      response.constructor.name,
      response.serializeBinary().length
    );
    return Promise.resolve(response);
  }

  onResponseStatus(status: StatusObject): Promise<StatusObject> {
    this.logger.debug(
      'Logging middleware: request %s onResponseStatus: status code: %s',
      this.requestId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      status.code
    );
    return Promise.resolve(status);
  }
}

export class LoggingMiddleware implements Middleware {
  private readonly logger: MomentoLogger;
  private nextRequestId: number;
  constructor(loggerFactory: MomentoLoggerFactory) {
    this.logger = loggerFactory.getLogger(this);
    this.nextRequestId = 0;
  }

  onNewRequest(): MiddlewareRequestHandler {
    this.logger.warn('LOGGING MIDDLEWARE.onNewRequest');
    this.nextRequestId++;
    return new LoggingMiddlewareRequestHandler(
      this.logger,
      this.nextRequestId.toString()
    );
  }
}
