/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {Middleware, MiddlewareRequestHandler} from '@gomomento/sdk';
import {
  MiddlewareMessage,
  MiddlewareMetadata,
  MiddlewareRequestHandlerContext,
  MiddlewareStatus,
} from '@gomomento/sdk/dist/src/config/middleware/middleware';
import {TextDecoder} from 'node:util';

export class LoggingMiddlewareRequestHandler implements MiddlewareRequestHandler {
  private readonly TEXT_DECODER = new TextDecoder();

  onRequestBody(request: MiddlewareMessage): Promise<MiddlewareMessage> {
    switch (request._grpcMessage.constructor.name) {
      case '_DictionarySetRequest':
        console.log(
          `Setting fields in dictionary '${this.TEXT_DECODER.decode(
            request._grpcMessage.dictionary_name
          )}': ${JSON.stringify(
            request._grpcMessage.items.map(i => [this.TEXT_DECODER.decode(i.field), this.TEXT_DECODER.decode(i.value)])
          )}`
        );
        break;
      case '_DictionaryFetchRequest':
        console.log(`Fetching dictionary '${this.TEXT_DECODER.decode(request._grpcMessage.dictionary_name)}'`);
        break;
    }

    return Promise.resolve(request);
  }

  onRequestMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata> {
    return Promise.resolve(metadata);
  }

  onResponseBody(response: MiddlewareMessage | null): Promise<MiddlewareMessage | null> {
    switch (response?._grpcMessage.constructor.name) {
      case '_DictionaryFetchResponse':
        console.log(
          `Got fields from dictionary: ${JSON.stringify(
            response._grpcMessage.found.items.map(i => [
              this.TEXT_DECODER.decode(i.field),
              this.TEXT_DECODER.decode(i.value),
            ])
          )}`
        );

        break;
    }
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
