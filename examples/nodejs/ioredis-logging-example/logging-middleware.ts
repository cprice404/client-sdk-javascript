import {Middleware, MiddlewareRequestHandler} from '@gomomento/sdk';
import {
  MiddlewareMessage,
  MiddlewareMetadata,
  MiddlewareRequestHandlerContext,
  MiddlewareStatus,
} from '@gomomento/sdk/dist/src/config/middleware/middleware';
import {TextDecoder, TextEncoder} from "node:util";

export class LoggingMiddlewareRequestHandler implements MiddlewareRequestHandler {
  private readonly TEXT_DECODER = new TextDecoder();

  onRequestBody(request: MiddlewareMessage): Promise<MiddlewareMessage> {
    console.log(`REQUEST CONSTRUCTOR: ${request._grpcMessage.constructor.name}`);
    console.log(`REQEUST: ${JSON.stringify(request)}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    console.log(`dictionary name: ${this.TEXT_DECODER.decode(request._grpcMessage.dictionary_name)}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    console.log(`dictionary items: ${JSON.stringify(request._grpcMessage.items.map(i => [this.TEXT_DECODER.decode(i.field), this.TEXT_DECODER.decode(i.value)]))}`);
    return Promise.resolve(request);
  }

  onRequestMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata> {
    return Promise.resolve(metadata);
  }

  onResponseBody(response: MiddlewareMessage | null): Promise<MiddlewareMessage | null> {
    return Promise.resolve(response);
  }

  onResponseMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata> {
    return Promise.resolve(metadata);
  }

  onResponseStatus(status: MiddlewareStatus): Promise<MiddlewareStatus> {
    return Promise.resolve(status);
  }
}

export class LoggingMiddleware implements Middleware {
  onNewRequest(context?: MiddlewareRequestHandlerContext): MiddlewareRequestHandler {
    return new LoggingMiddlewareRequestHandler();
  }
}
