import {Middleware, MiddlewareRequestHandler} from './middleware';
import {MomentoLogger, MomentoLoggerFactory} from '../logging/momento-logger';
import {Metadata, StatusObject} from '@grpc/grpc-js';

export class ExampleAsyncMiddlewareRequestHandler
  implements MiddlewareRequestHandler
{
  private readonly logger: MomentoLogger;

  constructor(logger: MomentoLogger) {
    this.logger = logger;
  }

  async onRequestMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.info('ExampleAsyncMiddleware.onRequestMetadata');
    await delay(500);
    return metadata;
  }

  async onRequestBody(request: any): Promise<any> {
    this.logger.info('ExampleAsyncMiddleware.onRequestBody');
    await delay(500);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request;
  }

  async onResponseMetadata(metadata: Metadata): Promise<Metadata> {
    this.logger.info('ExampleAsyncMiddleware.onResponseMetadata');
    await delay(500);
    return metadata;
  }

  async onResponseBody(response: any): Promise<any> {
    this.logger.info('ExampleAsyncMiddleware.onResponseBody');
    await delay(500);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
  }

  async onResponseStatus(status: StatusObject): Promise<StatusObject> {
    this.logger.info('ExampleAsyncMiddleware.onResponseStatus');
    await delay(500);
    return status;
  }
}

export class ExampleAsyncMiddleware implements Middleware {
  private readonly logger: MomentoLogger;

  constructor(loggerFactory: MomentoLoggerFactory) {
    this.logger = loggerFactory.getLogger(this);
  }
  onNewRequest(): MiddlewareRequestHandler {
    this.logger.info('ExampleAsyncMiddleware handling new request');
    return new ExampleAsyncMiddlewareRequestHandler(this.logger);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
