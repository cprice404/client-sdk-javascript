import {Message} from 'google-protobuf';
import {Request, UnaryResponse} from 'grpc-web';

// export class MiddlewareMetadata {
//   readonly _grpcMetadata: Metadata;
//   constructor(metadata: Metadata) {
//     this._grpcMetadata = metadata;
//   }
//
//   toJsonString(): string {
//     return JSON.stringify(this._grpcMetadata);
//   }
// }
// export class MiddlewareStatus {
//   readonly _grpcStatus: Status;
//   constructor(status: Status) {
//     this._grpcStatus = status;
//   }
//
//   code() {
//     return this._grpcStatus.code;
//   }
// }
//
// export class MiddlewareMessage {
//   readonly _grpcMessage: Message;
//   constructor(message: Message) {
//     this._grpcMessage = message;
//   }
//
//   messageLength(): number {
//     if (this._grpcMessage !== null && this._grpcMessage !== undefined) {
//       return this._grpcMessage.serializeBinary().length;
//     }
//     return 0;
//   }
// }

export class MiddlewareRequest {
  readonly _grpcRequest: Request<Message, Message>;

  constructor(request: Request<Message, Message>) {
    this._grpcRequest = request;
  }

  getMetadata(): {[s: string]: string} {
    return this._grpcRequest.getMetadata();
  }

  getRequestType(): string {
    return this._grpcRequest.constructor.name;
  }

  getBodySize() {
    return this._grpcRequest.getRequestMessage().serializeBinary().length;
  }
}

export class MiddlewareResponse {
  readonly _grpcResponse: UnaryResponse<Message, Message>;
  constructor(response: UnaryResponse<Message, Message>) {
    this._grpcResponse = response;
  }

  getStatusCode(): number {
    return this._grpcResponse.getStatus().code;
  }

  getMetadata(): {[s: string]: string} {
    return this._grpcResponse.getMetadata();
  }

  getResponseType(): string {
    return this._grpcResponse.constructor.name;
  }

  getBodySize() {
    return this._grpcResponse.getResponseMessage().serializeBinary().length;
  }
}

export interface MiddlewareRequestHandler {
  // onRequestMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata>;
  // onRequestBody(request: MiddlewareMessage): Promise<MiddlewareMessage>;
  //
  // onResponseMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata>;
  // onResponseBody(
  //   response: MiddlewareMessage | null
  // ): Promise<MiddlewareMessage | null>;
  // onResponseStatus(status: MiddlewareStatus): Promise<MiddlewareStatus>;
  onRequest(request: MiddlewareRequest): Promise<MiddlewareRequest>;
  onResponse(response: MiddlewareResponse): Promise<MiddlewareResponse>;
}

export interface MiddlewareRequestHandlerContext {
  [key: symbol]: string;
}

/**
 * The Middleware interface allows the Configuration to provide a higher-order function that wraps all requests.
 * This allows future support for things like client-side metrics or other diagnostics helpers.
 *
 * An optional context can be provided that is essentially a <key, value> map {@link MiddlewareRequestHandlerContext}.
 * The context object is available to each individual invocation of the request handler for the middleware.
 */
export interface Middleware {
  onNewRequest(
    context?: MiddlewareRequestHandlerContext
  ): MiddlewareRequestHandler;
}
