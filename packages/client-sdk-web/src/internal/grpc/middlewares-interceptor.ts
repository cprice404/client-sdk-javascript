// import {
//   InterceptingCall,
//   Interceptor,
//   InterceptorOptions,
//   Listener,
//   Metadata,
//   Requester,
//   StatusObject,
// } from '@grpc/grpc-js';
// import {NextCall} from '@grpc/grpc-js/build/src/client-interceptors';
import {
  Middleware,
  // MiddlewareMessage,
  // MiddlewareMetadata,
  MiddlewareRequest,
  // MiddlewareRequestHandler,
  MiddlewareRequestHandlerContext,
  MiddlewareResponse,
  // MiddlewareStatus,
} from '../../config/middleware/middleware';
import {Message} from 'google-protobuf';
import {MomentoLogger, MomentoLoggerFactory} from '../../';
import {Request, UnaryInterceptor, UnaryResponse} from 'grpc-web';

export function middlewaresInterceptor(
  loggerFactory: MomentoLoggerFactory,
  middlewares: Middleware[],
  middlewareRequestContext: MiddlewareRequestHandlerContext
): UnaryInterceptor<unknown, unknown> {
  return new MiddlewaresInterceptor(
    loggerFactory,
    middlewares,
    middlewareRequestContext
  );
}

class MiddlewaresInterceptor implements UnaryInterceptor<Message, Message> {
  private readonly logger: MomentoLogger;
  private readonly middlewares: Middleware[];
  private readonly middlewareRequestContext: MiddlewareRequestHandlerContext;

  constructor(
    loggerFactory: MomentoLoggerFactory,
    middlewares: Middleware[],
    middlewareRequestContext: MiddlewareRequestHandlerContext
  ) {
    this.logger = loggerFactory.getLogger(this.constructor.name);
    this.middlewares = middlewares;
    this.middlewareRequestContext = middlewareRequestContext;

    this.logger.warn('INSTANTIATING MIDDLEWARES INTERCEPTOR');
  }
  intercept(
    request: Request<Message, Message>,
    invoker: (
      request: Request<Message, Message>
    ) => Promise<UnaryResponse<Message, Message>>
  ): Promise<UnaryResponse<Message, Message>> {
    this.logger.warn('INTERCEPT!');
    const middlewareRequestHandlers = this.middlewares.map(m =>
      m.onNewRequest(this.middlewareRequestContext)
    );

    // create a copy of the handlers and reverse it, because for the response life cycle actions we should call
    // the middlewares in the opposite order.
    const reversedMiddlewareRequestHandlers = [
      ...middlewareRequestHandlers,
    ].reverse();

    const initialRequest = new MiddlewareRequest(request);

    const transformedRequest = middlewareRequestHandlers.reduce(
      (accRequest, h) => accRequest.then(mr => h.onRequest(mr)),
      Promise.resolve(initialRequest)
    );

    const responsePromise = transformedRequest.then(r => {
      const initialResponse = invoker(r._grpcRequest);
      const transformedResponse = reversedMiddlewareRequestHandlers.reduce(
        (accResponse, h) => accResponse.then(mr => h.onResponse(mr)),
        initialResponse.then(r => new MiddlewareResponse(r))
      );
      return transformedResponse.then(r => r._grpcResponse);
    });
    //
    // invoker()
    //
    // // const request = middlewareRequestHandlers.reduce();
    //
    // let responsePromise: Promise<UnaryResponse<unknown, unknown>>;
    // reversedMiddlewareRequestHandlers.forEach(h => {
    //   responsePromise = applyMiddlewareHandler(h, request, invoker);
    // });
    //
    return responsePromise;

    //
    //
    // applyMiddlewareHandlers();
    //
    // const requester: Requester = {
    //   start: function (
    //     metadata: Metadata,
    //     listener: Listener,
    //     next: (metadata: Metadata, listener: Listener) => void
    //   ): void {
    //     const newListener: Listener = {
    //       onReceiveMetadata: function (
    //         metadata: Metadata,
    //         next: (metadata: Metadata) => void
    //       ): void {
    //         applyMiddlewareHandlers(
    //           'onResponseMetadata',
    //           reversedMiddlewareRequestHandlers,
    //           (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
    //             h.onResponseMetadata(m),
    //           new MiddlewareMetadata(metadata),
    //           (metadata: MiddlewareMetadata) => next(metadata._grpcMetadata)
    //         );
    //       },
    //       onReceiveMessage: function (
    //         // unfortunately grpc uses `any` in their type defs for these
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         message: any,
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         next: (message: any) => void
    //       ): void {
    //         applyMiddlewareHandlers(
    //           'onResponseBody',
    //           reversedMiddlewareRequestHandlers,
    //           (h: MiddlewareRequestHandler) =>
    //             (request: MiddlewareMessage | null) =>
    //               h.onResponseBody(request),
    //           new MiddlewareMessage(message as Message),
    //           (msg: MiddlewareMessage | null) => next(msg?._grpcMessage)
    //         );
    //       },
    //       onReceiveStatus: function (
    //         status: StatusObject,
    //         next: (status: StatusObject) => void
    //       ): void {
    //         applyMiddlewareHandlers(
    //           'onResponseStatus',
    //           reversedMiddlewareRequestHandlers,
    //           (h: MiddlewareRequestHandler) => (s: MiddlewareStatus) =>
    //             h.onResponseStatus(s),
    //           new MiddlewareStatus(status),
    //           (s: MiddlewareStatus) => next(s._grpcStatus)
    //         );
    //       },
    //     };
    //
    //     applyMiddlewareHandlers(
    //       'onRequestMetadata',
    //       middlewareRequestHandlers,
    //       (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
    //         h.onRequestMetadata(m),
    //       new MiddlewareMetadata(metadata),
    //       (m: MiddlewareMetadata) => next(m._grpcMetadata, newListener)
    //     );
    //   },
    //   // unfortunately grpc uses `any` in their type defs for these
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   sendMessage: function (message: any, next: (message: any) => void): void {
    //     applyMiddlewareHandlers(
    //       'onRequestBody',
    //       middlewareRequestHandlers,
    //       (h: MiddlewareRequestHandler) => (request: MiddlewareMessage) =>
    //         h.onRequestBody(request),
    //       new MiddlewareMessage(message as Message),
    //       (m: MiddlewareMessage) => next(m._grpcMessage)
    //     );
    //   },
    // };
    // return new InterceptingCall(nextCall(options), requester);
  }
}
//
// function applyMiddlewareHandler(
//   h: MiddlewareRequestHandler,
//   request: Request<unknown, unknown>,
//   invoker: (
//     request: Request<unknown, unknown>
//   ) => Promise<UnaryResponse<unknown, unknown>>
// ): Promise<UnaryResponse<unknown, unknown>> {
//   h.onRequestMetadata(request.getMetadata());
//   h.onRequestBody(request.getRequestMessage());
//   const something = invoker(request);
//   something.then(r => {
//     h.onResponseStatus(r.getStatus());
//     h.onResponseMetadata(r.getMetadata());
//     h.onResponseBody(r.getResponseMessage());
//   });
//   return something;
// }

// function applyMiddlewareHandlers<T>(
//   name: string,
//   handlers: MiddlewareRequestHandler[],
//   middlewareHandlerReduceFn: (
//     h: MiddlewareRequestHandler
//   ) => (t: T) => Promise<T>,
//   originalInput: T,
//   nextFn: (t: T) => void
// ) {
//   let remainingHandlers = handlers;
//   let middlewarePromise: Promise<T> = Promise.resolve(originalInput);
//   while (remainingHandlers.length > 0) {
//     const nextHandler = middlewareHandlerReduceFn(remainingHandlers[0]);
//     middlewarePromise = middlewarePromise
//       .then(newT => nextHandler(newT))
//       .catch(e => {
//         throw e;
//       });
//     remainingHandlers = remainingHandlers.slice(1);
//   }
//
//   middlewarePromise
//     .then(newT => nextFn(newT))
//     .catch(e => {
//       throw e;
//     });
// }
