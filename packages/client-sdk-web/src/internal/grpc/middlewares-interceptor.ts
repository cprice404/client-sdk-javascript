import {
  Middleware,
  // MiddlewareMessage,
  // MiddlewareMetadata,
  MiddlewareRequestHandler,
  MiddlewareRequestHandlerContext,
  MiddlewareStatus,
  // MiddlewareStatus,
} from '../../config/middleware/middleware';
import {Message} from 'google-protobuf';
import {MomentoLogger, MomentoLoggerFactory} from '../../';
import {
  ClientReadableStream,
  Metadata,
  Request,
  RpcError,
  Status,
  StreamInterceptor,
} from 'grpc-web';

export function middlewaresInterceptor(
  loggerFactory: MomentoLoggerFactory,
  middlewares: Middleware[],
  middlewareRequestContext: MiddlewareRequestHandlerContext
): StreamInterceptor<Message, Message> {
  return new MiddlewareStreamInterceptor(
    loggerFactory,
    middlewares,
    middlewareRequestContext
  );
}

class MiddlewareStreamInterceptor
  implements StreamInterceptor<Message, Message>
{
  readonly logger: MomentoLogger;
  readonly middlewares: Middleware[];
  readonly middlewareRequestContext: MiddlewareRequestHandlerContext;

  constructor(
    loggerFactory: MomentoLoggerFactory,
    middlewares: Middleware[],
    middlewareRequestContext: MiddlewareRequestHandlerContext
  ) {
    this.logger = loggerFactory.getLogger(this.constructor.name);
    this.middlewares = middlewares;
    this.middlewareRequestContext = middlewareRequestContext;
    this.logger.warn('CONSTRUCTED MIDDLEWARE STREAM INTERCEPTOR!');
  }

  intercept(
    request: Request<Message, Message>,
    invoker: (
      request: Request<Message, Message>
    ) => ClientReadableStream<Message>
  ): ClientReadableStream<Message> {
    this.logger.warn('INTERCEPTING REQUEST!');
    return new MiddlewareInterceptedStream(
      this.logger,
      this.middlewares,
      this.middlewareRequestContext,
      request,
      invoker(request)
    );
  }
}

class MiddlewareInterceptedStream implements ClientReadableStream<Message> {
  readonly logger: MomentoLogger;
  readonly middlewares: Middleware[];
  readonly middlewareRequestContext: MiddlewareRequestHandlerContext;
  readonly middlewareRequestHandlers: MiddlewareRequestHandler[];
  readonly reversedMiddlewareRequestHandlers: MiddlewareRequestHandler[];
  readonly stream: ClientReadableStream<Message>;

  constructor(
    logger: MomentoLogger,
    middlewares: Middleware[],
    middlewareRequestContext: MiddlewareRequestHandlerContext,
    request: Request<Message, Message>,
    stream: ClientReadableStream<Message>
  ) {
    this.logger = logger;
    this.middlewares = middlewares;
    this.middlewareRequestContext = middlewareRequestContext;
    this.stream = stream;

    this.middlewareRequestHandlers = this.middlewares.map(m =>
      m.onNewRequest(this.middlewareRequestContext)
    );

    this.reversedMiddlewareRequestHandlers = [
      ...this.middlewareRequestHandlers,
    ].reverse();
  }

  //
  // on: ((eventType: "error", callback: (err: RpcError) => void) => ClientReadableStream<Message>) & ((eventType: "status", callback: (status: Status) => void) => ClientReadableStream<Message>) & ((eventType: "metadata", callback: (status: Metadata) => void) => ClientReadableStream<Message>) & ((eventType: "data", callback: (response: Message) => void) => ClientReadableStream<Message>) & ((eventType: "end", callback: () => void) => ClientReadableStream<Message>);
  // removeListener: ((eventType: "error", callback: (err: RpcError) => void) => void) & ((eventType: "status", callback: (status: Status) => void) => void) & ((eventType: "metadata", callback: (status: Metadata) => void) => void) & ((eventType: "data", callback: (response: Message) => void) => void) & ((eventType: "end", callback: () => void) => void);
  //

  on(
    eventType: 'error',
    callback: (err: RpcError) => void
  ): ClientReadableStream<Message>;
  on(
    eventType: 'status',
    callback: (status: Status) => void
  ): ClientReadableStream<Message>;
  on(
    eventType: 'metadata',
    callback: (status: Metadata) => void
  ): ClientReadableStream<Message>;
  on(
    eventType: 'data',
    callback: (response: Message) => void
  ): ClientReadableStream<Message>;
  on(eventType: 'end', callback: () => void): ClientReadableStream<Message>;
  on(
    eventType: 'error' | 'status' | 'metadata' | 'data' | 'end',
    callback: (arg: any) => void
  ): ClientReadableStream<Message> {
    this.logger.warn(`INTERCEPTOR GOT EVENT: ${eventType}`);
    switch (eventType) {
      case 'error':
        this.onError(eventType, callback);
        break;
      case 'status':
        this.onStatus(eventType, callback);
        break;
      case 'metadata':
        this.onMetadata(eventType, callback);
        break;
      case 'data':
        this.onData(eventType, callback);
        break;
      case 'end':
        this.onEnd(eventType, callback);
        break;
    }
    return this;
  }

  removeListener(eventType: 'error', callback: (err: RpcError) => void): void;
  removeListener(eventType: 'status', callback: (status: Status) => void): void;
  removeListener(
    eventType: 'metadata',
    callback: (status: Metadata) => void
  ): void;
  removeListener(
    eventType: 'data',
    callback: (response: Message) => void
  ): void;
  removeListener(eventType: 'end', callback: () => void): void;
  removeListener(
    eventType: 'error' | 'status' | 'metadata' | 'data' | 'end',
    callback: (arg: any) => void
  ): void {
    this.logger.warn(`INTERCEPTOR REMOVING LISTENER: ${eventType}`);
    return;
  }

  cancel(): void {
    this.stream.cancel();
  }

  private onError(eventType: 'error', callback: (err: RpcError) => void): void {
    this.stream.on('error', callback);
  }

  private onStatus(
    eventType: 'status',
    callback: (status: Status) => void
  ): void {
    this.logger.warn('CREATING NEW CALLBACK FOR STATUS');
    const newCallback = (status: Status) => {
      this.logger.warn('IN NEW CALLBACK FOR STATUS');
      applyMiddlewareHandlers(
        'onResponseStatus',
        this.reversedMiddlewareRequestHandlers,
        (h: MiddlewareRequestHandler) => (s: MiddlewareStatus) =>
          h.onResponseStatus(s),
        new MiddlewareStatus(status),
        (s: MiddlewareStatus) => callback(s._grpcStatus)
      );
    };
    this.stream.on(eventType, newCallback);
  }

  private onMetadata(
    eventType: 'metadata',
    callback: (metadata: Metadata) => void
  ): void {
    this.logger.warn('CREATING NEW CALLBACK FOR Metadata');
    const newCallback = (status: Status) => {
      this.logger.warn('IN NEW CALLBACK FOR Metadata');
      applyMiddlewareHandlers(
        'onResponseMetadata',
        this.reversedMiddlewareRequestHandlers,
        (h: MiddlewareRequestHandler) => (s: MiddlewareStatus) =>
          h.onResponseStatus(s),
        new MiddlewareStatus(status),
        (s: MiddlewareStatus) => callback(s._grpcStatus)
      );
    };
    this.stream.on(eventType, newCallback);
  }

  //   // create a copy of the handlers and reverse it, because for the response life cycle actions we should call
  //   // the middlewares in the opposite order.
  //   const reversedMiddlewareRequestHandlers = [
  //     ...middlewareRequestHandlers,
  //   ].reverse();
  //
  //   const requester: Requester = {
  //     start: function (
  //       metadata: Metadata,
  //       listener: Listener,
  //       next: (metadata: Metadata, listener: Listener) => void
  //     ): void {
  //       const newListener: Listener = {
  //         onReceiveMetadata: function (
  //           metadata: Metadata,
  //           next: (metadata: Metadata) => void
  //         ): void {
  //           applyMiddlewareHandlers(
  //             'onResponseMetadata',
  //             reversedMiddlewareRequestHandlers,
  //             (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
  //               h.onResponseMetadata(m),
  //             new MiddlewareMetadata(metadata),
  //             (metadata: MiddlewareMetadata) => next(metadata._grpcMetadata)
  //           );
  //         },
  //         onReceiveMessage: function (
  //           // unfortunately grpc uses `any` in their type defs for these
  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //           message: any,
  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //           next: (message: any) => void
  //         ): void {
  //           applyMiddlewareHandlers(
  //             'onResponseBody',
  //             reversedMiddlewareRequestHandlers,
  //             (h: MiddlewareRequestHandler) =>
  //               (request: MiddlewareMessage | null) =>
  //                 h.onResponseBody(request),
  //             new MiddlewareMessage(message as Message),
  //             (msg: MiddlewareMessage | null) => next(msg?._grpcMessage)
  //           );
  //         },
  //         onReceiveStatus: function (
  //           status: StatusObject,
  //           next: (status: StatusObject) => void
  //         ): void {
  //           applyMiddlewareHandlers(
  //             'onResponseStatus',
  //             reversedMiddlewareRequestHandlers,
  //             (h: MiddlewareRequestHandler) => (s: MiddlewareStatus) =>
  //               h.onResponseStatus(s),
  //             new MiddlewareStatus(status),
  //             (s: MiddlewareStatus) => next(s._grpcStatus)
  //           );
  //         },
  //       };
  //
  //       applyMiddlewareHandlers(
  //         'onRequestMetadata',
  //         middlewareRequestHandlers,
  //         (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
  //           h.onRequestMetadata(m),
  //         new MiddlewareMetadata(metadata),
  //         (m: MiddlewareMetadata) => next(m._grpcMetadata, newListener)
  //       );
  //     },
  //     // unfortunately grpc uses `any` in their type defs for these
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     sendMessage: function (message: any, next: (message: any) => void): void {
  //       applyMiddlewareHandlers(
  //         'onRequestBody',
  //         middlewareRequestHandlers,
  //         (h: MiddlewareRequestHandler) => (request: MiddlewareMessage) =>
  //           h.onRequestBody(request),
  //         new MiddlewareMessage(message as Message),
  //         (m: MiddlewareMessage) => next(m._grpcMessage)
  //       );
  //     },
  //   };
  //   return new InterceptingCall(nextCall(options), requester);
  // }
}

function applyMiddlewareHandlers<T>(
  name: string,
  handlers: MiddlewareRequestHandler[],
  middlewareHandlerReduceFn: (
    h: MiddlewareRequestHandler
  ) => (t: T) => Promise<T>,
  originalInput: T,
  nextFn: (t: T) => void
) {
  let remainingHandlers = handlers;
  let middlewarePromise: Promise<T> = Promise.resolve(originalInput);
  while (remainingHandlers.length > 0) {
    const nextHandler = middlewareHandlerReduceFn(remainingHandlers[0]);
    middlewarePromise = middlewarePromise
      .then(newT => nextHandler(newT))
      .catch(e => {
        throw e;
      });
    remainingHandlers = remainingHandlers.slice(1);
  }

  middlewarePromise
    .then(newT => nextFn(newT))
    .catch(e => {
      throw e;
    });
}

// // import {
// //   InterceptingCall,
// //   Interceptor,
// //   InterceptorOptions,
// //   Listener,
// //   Metadata,
// //   Requester,
// //   StatusObject,
// // } from '@grpc/grpc-js';
// // import {NextCall} from '@grpc/grpc-js/build/src/client-interceptors';
// import {
//   Middleware,
//   // MiddlewareMessage,
//   // MiddlewareMetadata,
//   MiddlewareRequest,
//   // MiddlewareRequestHandler,
//   MiddlewareRequestHandlerContext,
//   MiddlewareResponse,
//   // MiddlewareStatus,
// } from '../../config/middleware/middleware';
// import {Message} from 'google-protobuf';
// import {MomentoLogger, MomentoLoggerFactory} from '../../';
// import {
//   ClientReadableStream,
//   Request,
//   StreamInterceptor,
//   UnaryInterceptor,
//   UnaryResponse,
// } from 'grpc-web';
//
// export function middlewaresInterceptor(
//   loggerFactory: MomentoLoggerFactory,
//   middlewares: Middleware[],
//   middlewareRequestContext: MiddlewareRequestHandlerContext
// ): UnaryInterceptor<unknown, unknown> {
//   return new MiddlewaresInterceptor(
//     loggerFactory,
//     middlewares,
//     middlewareRequestContext
//   );
// }
//
// class MiddlewaresInterceptor implements StreamInterceptor<Message, Message> {
//   private readonly logger: MomentoLogger;
//   private readonly middlewares: Middleware[];
//   private readonly middlewareRequestContext: MiddlewareRequestHandlerContext;
//
//   constructor(
//     loggerFactory: MomentoLoggerFactory,
//     middlewares: Middleware[],
//     middlewareRequestContext: MiddlewareRequestHandlerContext
//   ) {
//     this.logger = loggerFactory.getLogger(this.constructor.name);
//     this.middlewares = middlewares;
//     this.middlewareRequestContext = middlewareRequestContext;
//
//     this.logger.warn('INSTANTIATING MIDDLEWARES INTERCEPTOR');
//   }
//
//   intercept(
//     request: Request<Message, Message>,
//     invoker: (
//       request: Request<Message, Message>
//     ) => ClientReadableStream<Message>
//   ): ClientReadableStream<Message> {
//     this.logger.warn('INTERCEPT!');
//     const middlewareRequestHandlers = this.middlewares.map(m =>
//       m.onNewRequest(this.middlewareRequestContext)
//     );
//
//     // create a copy of the handlers and reverse it, because for the response life cycle actions we should call
//     // the middlewares in the opposite order.
//     const reversedMiddlewareRequestHandlers = [
//       ...middlewareRequestHandlers,
//     ].reverse();
//
//     const initialRequest = new MiddlewareRequest(request);
//
//     const transformedRequest = middlewareRequestHandlers.reduce(
//       (accRequest, h) => accRequest.then(mr => h.onRequest(mr)),
//       Promise.resolve(initialRequest)
//     );
//
//     const responsePromise = transformedRequest.then(r => {
//       const initialResponse = invoker(r._grpcRequest);
//       initialResponse.on('end', () => {
//         this.logger.warn('GOT AN END EVENT! NEED TO CALL THE MIDDLEWARES BACK');
//       });
//
//       // const transformedResponse = reversedMiddlewareRequestHandlers.reduce(
//       //   (accResponse, h) => accResponse.then(mr => h.onResponse(mr)),
//       //   initialResponse.then(r => new MiddlewareResponse(r))
//       // );
//       // return transformedResponse.then(r => r._grpcResponse);
//       return initialResponse;
//     });
//     return responsePromise;
//   }
//
//   // intercept(
//   //   request: Request<Message, Message>,
//   //   invoker: (
//   //     request: Request<Message, Message>
//   //   ) => Promise<UnaryResponse<Message, Message>>
//   // ): Promise<UnaryResponse<Message, Message>> {
//   //   this.logger.warn('INTERCEPT!');
//   //   const middlewareRequestHandlers = this.middlewares.map(m =>
//   //     m.onNewRequest(this.middlewareRequestContext)
//   //   );
//   //
//   //   // create a copy of the handlers and reverse it, because for the response life cycle actions we should call
//   //   // the middlewares in the opposite order.
//   //   const reversedMiddlewareRequestHandlers = [
//   //     ...middlewareRequestHandlers,
//   //   ].reverse();
//   //
//   //   const initialRequest = new MiddlewareRequest(request);
//   //
//   //   const transformedRequest = middlewareRequestHandlers.reduce(
//   //     (accRequest, h) => accRequest.then(mr => h.onRequest(mr)),
//   //     Promise.resolve(initialRequest)
//   //   );
//   //
//   //   const responsePromise = transformedRequest.then(r => {
//   //     const initialResponse = invoker(r._grpcRequest);
//   //     const transformedResponse = reversedMiddlewareRequestHandlers.reduce(
//   //       (accResponse, h) => accResponse.then(mr => h.onResponse(mr)),
//   //       initialResponse.then(r => new MiddlewareResponse(r))
//   //     );
//   //     return transformedResponse.then(r => r._grpcResponse);
//   //   });
//   //   return responsePromise;
//   // }
// }
//
// // class MiddlewaresInterceptor implements UnaryInterceptor<Message, Message> {
// //   private readonly logger: MomentoLogger;
// //   private readonly middlewares: Middleware[];
// //   private readonly middlewareRequestContext: MiddlewareRequestHandlerContext;
// //
// //   constructor(
// //     loggerFactory: MomentoLoggerFactory,
// //     middlewares: Middleware[],
// //     middlewareRequestContext: MiddlewareRequestHandlerContext
// //   ) {
// //     this.logger = loggerFactory.getLogger(this.constructor.name);
// //     this.middlewares = middlewares;
// //     this.middlewareRequestContext = middlewareRequestContext;
// //
// //     this.logger.warn('INSTANTIATING MIDDLEWARES INTERCEPTOR');
// //   }
// //   intercept(
// //     request: Request<Message, Message>,
// //     invoker: (
// //       request: Request<Message, Message>
// //     ) => Promise<UnaryResponse<Message, Message>>
// //   ): Promise<UnaryResponse<Message, Message>> {
// //     this.logger.warn('INTERCEPT!');
// //     const middlewareRequestHandlers = this.middlewares.map(m =>
// //       m.onNewRequest(this.middlewareRequestContext)
// //     );
// //
// //     // create a copy of the handlers and reverse it, because for the response life cycle actions we should call
// //     // the middlewares in the opposite order.
// //     const reversedMiddlewareRequestHandlers = [
// //       ...middlewareRequestHandlers,
// //     ].reverse();
// //
// //     const initialRequest = new MiddlewareRequest(request);
// //
// //     const transformedRequest = middlewareRequestHandlers.reduce(
// //       (accRequest, h) => accRequest.then(mr => h.onRequest(mr)),
// //       Promise.resolve(initialRequest)
// //     );
// //
// //     const responsePromise = transformedRequest.then(r => {
// //       const initialResponse = invoker(r._grpcRequest);
// //       const transformedResponse = reversedMiddlewareRequestHandlers.reduce(
// //         (accResponse, h) => accResponse.then(mr => h.onResponse(mr)),
// //         initialResponse.then(r => new MiddlewareResponse(r))
// //       );
// //       return transformedResponse.then(r => r._grpcResponse);
// //     });
// //     //
// //     // invoker()
// //     //
// //     // // const request = middlewareRequestHandlers.reduce();
// //     //
// //     // let responsePromise: Promise<UnaryResponse<unknown, unknown>>;
// //     // reversedMiddlewareRequestHandlers.forEach(h => {
// //     //   responsePromise = applyMiddlewareHandler(h, request, invoker);
// //     // });
// //     //
// //     return responsePromise;
// //
// //     //
// //     //
// //     // applyMiddlewareHandlers();
// //     //
// //     // const requester: Requester = {
// //     //   start: function (
// //     //     metadata: Metadata,
// //     //     listener: Listener,
// //     //     next: (metadata: Metadata, listener: Listener) => void
// //     //   ): void {
// //     //     const newListener: Listener = {
// //     //       onReceiveMetadata: function (
// //     //         metadata: Metadata,
// //     //         next: (metadata: Metadata) => void
// //     //       ): void {
// //     //         applyMiddlewareHandlers(
// //     //           'onResponseMetadata',
// //     //           reversedMiddlewareRequestHandlers,
// //     //           (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
// //     //             h.onResponseMetadata(m),
// //     //           new MiddlewareMetadata(metadata),
// //     //           (metadata: MiddlewareMetadata) => next(metadata._grpcMetadata)
// //     //         );
// //     //       },
// //     //       onReceiveMessage: function (
// //     //         // unfortunately grpc uses `any` in their type defs for these
// //     //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     //         message: any,
// //     //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     //         next: (message: any) => void
// //     //       ): void {
// //     //         applyMiddlewareHandlers(
// //     //           'onResponseBody',
// //     //           reversedMiddlewareRequestHandlers,
// //     //           (h: MiddlewareRequestHandler) =>
// //     //             (request: MiddlewareMessage | null) =>
// //     //               h.onResponseBody(request),
// //     //           new MiddlewareMessage(message as Message),
// //     //           (msg: MiddlewareMessage | null) => next(msg?._grpcMessage)
// //     //         );
// //     //       },
// //     //       onReceiveStatus: function (
// //     //         status: StatusObject,
// //     //         next: (status: StatusObject) => void
// //     //       ): void {
// //     //         applyMiddlewareHandlers(
// //     //           'onResponseStatus',
// //     //           reversedMiddlewareRequestHandlers,
// //     //           (h: MiddlewareRequestHandler) => (s: MiddlewareStatus) =>
// //     //             h.onResponseStatus(s),
// //     //           new MiddlewareStatus(status),
// //     //           (s: MiddlewareStatus) => next(s._grpcStatus)
// //     //         );
// //     //       },
// //     //     };
// //     //
// //     //     applyMiddlewareHandlers(
// //     //       'onRequestMetadata',
// //     //       middlewareRequestHandlers,
// //     //       (h: MiddlewareRequestHandler) => (m: MiddlewareMetadata) =>
// //     //         h.onRequestMetadata(m),
// //     //       new MiddlewareMetadata(metadata),
// //     //       (m: MiddlewareMetadata) => next(m._grpcMetadata, newListener)
// //     //     );
// //     //   },
// //     //   // unfortunately grpc uses `any` in their type defs for these
// //     //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     //   sendMessage: function (message: any, next: (message: any) => void): void {
// //     //     applyMiddlewareHandlers(
// //     //       'onRequestBody',
// //     //       middlewareRequestHandlers,
// //     //       (h: MiddlewareRequestHandler) => (request: MiddlewareMessage) =>
// //     //         h.onRequestBody(request),
// //     //       new MiddlewareMessage(message as Message),
// //     //       (m: MiddlewareMessage) => next(m._grpcMessage)
// //     //     );
// //     //   },
// //     // };
// //     // return new InterceptingCall(nextCall(options), requester);
// //   }
// // }
// //
// // function applyMiddlewareHandler(
// //   h: MiddlewareRequestHandler,
// //   request: Request<unknown, unknown>,
// //   invoker: (
// //     request: Request<unknown, unknown>
// //   ) => Promise<UnaryResponse<unknown, unknown>>
// // ): Promise<UnaryResponse<unknown, unknown>> {
// //   h.onRequestMetadata(request.getMetadata());
// //   h.onRequestBody(request.getRequestMessage());
// //   const something = invoker(request);
// //   something.then(r => {
// //     h.onResponseStatus(r.getStatus());
// //     h.onResponseMetadata(r.getMetadata());
// //     h.onResponseBody(r.getResponseMessage());
// //   });
// //   return something;
// // }
//
// // function applyMiddlewareHandlers<T>(
// //   name: string,
// //   handlers: MiddlewareRequestHandler[],
// //   middlewareHandlerReduceFn: (
// //     h: MiddlewareRequestHandler
// //   ) => (t: T) => Promise<T>,
// //   originalInput: T,
// //   nextFn: (t: T) => void
// // ) {
// //   let remainingHandlers = handlers;
// //   let middlewarePromise: Promise<T> = Promise.resolve(originalInput);
// //   while (remainingHandlers.length > 0) {
// //     const nextHandler = middlewareHandlerReduceFn(remainingHandlers[0]);
// //     middlewarePromise = middlewarePromise
// //       .then(newT => nextHandler(newT))
// //       .catch(e => {
// //         throw e;
// //       });
// //     remainingHandlers = remainingHandlers.slice(1);
// //   }
// //
// //   middlewarePromise
// //     .then(newT => nextFn(newT))
// //     .catch(e => {
// //       throw e;
// //     });
// // }
