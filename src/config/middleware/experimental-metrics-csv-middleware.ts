import {Middleware, MiddlewareRequestHandler} from './middleware';
import {Metadata, StatusObject} from '@grpc/grpc-js';
import {Message} from 'google-protobuf';

export class ExperimentalMetricsCsvMiddlewareRequestHandler
  implements MiddlewareRequestHandler
{
  private readonly csvPath: string;
  private readonly startTime: [number, number];
  private requestType: string;
  private requestSize: number;
  private responseSize: number;

  constructor(csvPath: string) {
    this.csvPath = csvPath;
    console.log(`csv path: ${this.csvPath}`);
    this.startTime = process.hrtime();
  }

  onRequestBody(request: Message): Promise<Message> {
    this.requestSize = request.serializeBinary().length;
    this.requestType = request.constructor.name;
    return Promise.resolve(request);
  }

  onRequestMetadata(metadata: Metadata): Promise<Metadata> {
    return Promise.resolve(metadata);
  }

  onResponseBody(response: Message): Promise<Message> {
    this.responseSize = response.serializeBinary().length;
    return Promise.resolve(response);
  }

  onResponseMetadata(metadata: Metadata): Promise<Metadata> {
    return Promise.resolve(metadata);
  }

  onResponseStatus(status: StatusObject): Promise<StatusObject> {
    console.log(
      `\n\nclosing out request: ${this.requestType}, ${this.requestSize}, ${
        this.responseSize
      }, ${
        status.code
      }, ${ExperimentalMetricsCsvMiddlewareRequestHandler.getElapsedMillis(
        this.startTime
      )}\n\n`
    );
    return Promise.resolve(status);
  }

  private static getElapsedMillis(startTime: [number, number]): number {
    const endTime = process.hrtime(startTime);
    return (endTime[0] * 1e9 + endTime[1]) / 1e6;
  }

  // private readonly logger: MomentoLogger;
  // private readonly requestId: string;
  // constructor(logger: MomentoLogger, requestId: string) {
  //   this.logger = logger;
  //   this.requestId = requestId;
  // }
  //
  // onRequestMetadata(metadata: Metadata): Promise<Metadata> {
  //   this.logger.debug(
  //     'Logging middleware: request %s onRequestMetadata: %s',
  //     this.requestId,
  //     JSON.stringify(metadata.toJSON())
  //   );
  //   return Promise.resolve(metadata);
  // }
  // onRequestBody(request: Message): Promise<Message> {
  //   this.logger.debug(
  //     'Logging middleware: request %s onRequestBody: request type: %s, request size: %s',
  //     this.requestId,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     request.constructor.name,
  //     request.toString().length
  //   );
  //   return Promise.resolve(request);
  // }
  //
  // onResponseMetadata(metadata: Metadata): Promise<Metadata> {
  //   this.logger.debug(
  //     'Logging middleware: request %s onResponseMetadata: %s',
  //     this.requestId,
  //     JSON.stringify(metadata.toJSON())
  //   );
  //   return Promise.resolve(metadata);
  // }
  //
  // onResponseBody(response: Message): Promise<Message> {
  //   this.logger.debug(
  //     'Logging middleware: request %s onResponseBody: response type: %s, response size: %s',
  //     this.requestId,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     response.constructor.name,
  //     response.toString().length
  //   );
  //   return Promise.resolve(response);
  // }
  //
  // onResponseStatus(status: StatusObject): Promise<StatusObject> {
  //   this.logger.debug(
  //     'Logging middleware: request %s onResponseStatus: status code: %s',
  //     this.requestId,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     status.code
  //   );
  //   return Promise.resolve(status);
  // }
}

export class ExperimentalMetricsCsvMiddleware implements Middleware {
  // private readonly logger: MomentoLogger;
  // private nextRequestId: number;
  // constructor(loggerFactory: MomentoLoggerFactory) {
  //   this.logger = loggerFactory.getLogger(this);
  //   this.nextRequestId = 0;
  // }

  private readonly csvPath: string;
  constructor(csvPath: string) {
    this.csvPath = csvPath;
  }

  onNewRequest(): MiddlewareRequestHandler {
    console.log('\n\nMETRICS MIDDLEWARE: NEW REQUEST\n\n');
    return new ExperimentalMetricsCsvMiddlewareRequestHandler(this.csvPath);
  }

  //
  // onNewRequest(): MiddlewareRequestHandler {
  //   this.logger.warn('LOGGING MIDDLEWARE.onNewRequest');
  //   this.nextRequestId++;
  //   return new LoggingMiddlewareRequestHandler(
  //     this.logger,
  //     this.nextRequestId.toString()
  //   );
  // }
}
