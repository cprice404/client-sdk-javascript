import {
  InterceptingCall,
  Interceptor,
  InterceptorOptions,
  Listener,
  Metadata,
  Requester,
  StatusObject,
  // StatusObject,
} from '@grpc/grpc-js';
import {NextCall} from '@grpc/grpc-js/build/src/client-interceptors';
import {
  Middleware,
  MiddlewareRequestHandler,
} from '../../config/middleware/middleware';
import {MomentoLoggerFactory} from '../../config/logging/momento-logger';

export function middlewaresInterceptor(
  loggerFactory: MomentoLoggerFactory,
  middlewares: Middleware[]
): Interceptor {
  // const logger = loggerFactory.getLogger('MiddlewaresInterceptor');
  return (options: InterceptorOptions, nextCall: NextCall) => {
    const middlewareRequestHandlers = middlewares.map(m => m.onNewRequest());
    // const oneMiddlewareRequestHandler = middlewareRequestHandlers[0];
    // let savedOutboundMetadata: Metadata;
    // let savedOutboundRequest: any;
    // let savedMetadataCallback: Promise<
    //   (status: StatusObject, metadata: Metadata, response: any) => void
    // >;
    const requester: Requester = {
      start: function (
        metadata: Metadata,
        listener: Listener,
        next: (metadata: Metadata, listener: Listener) => void
      ): void {
        // logger.warn(
        //   `MIDDLEWARE INTERCEPTOR: REQUESTER.start: metadata: ${JSON.stringify(
        //     metadata.toJSON()
        //   )}`
        // );
        // savedOutboundMetadata = metadata;

        // next(metadata, listener);

        const newListener: Listener = {
          onReceiveMetadata: function (
            metadata: Metadata,
            next: (metadata: Metadata) => void
          ): void {
            // logger.warn(
            //   `MIDDLEWARE INTERCEPTOR: LISTENER.onReceiveMetadata: metadata: ${JSON.stringify(
            //     metadata.toJSON()
            //   )}`
            // );
            applyMiddlewareHandlers(
              'onResponseMetadata',
              middlewareRequestHandlers.reverse(),
              (h: MiddlewareRequestHandler) => (m: Metadata) =>
                h.onResponseMetadata(m),
              metadata,
              next
            );
            //
            // const middlewarePromise: (metadata: Metadata) => Promise<Metadata> =
            //   middlewareRequestHandlers
            //     .map(h => (m: Metadata) => h.onResponseMetadata(m))
            //     .reduce((previous, current) => (m: Metadata) => {
            //       const prevMetadataPromise = previous(m);
            //       return prevMetadataPromise
            //         .then(newMetadata => current(newMetadata))
            //         .catch(e => {
            //           throw e;
            //         });
            //     });
            //
            // middlewarePromise(metadata)
            //   .then(newMetadata => next(newMetadata))
            //   .catch(e => {
            //     throw e;
            //   });

            //////////////////////////////////////////////////////////////

            //
            // oneMiddlewareRequestHandler
            //   .onResponseMetadata(metadata)
            //   .then(newMetadata => next(newMetadata))
            //   .catch(e => {
            //     throw e;
            //   });
            // next(metadata);
          },
          onReceiveMessage: function (
            message: any,
            next: (message: any) => void
          ): void {
            // logger.warn(
            //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            //   `MIDDLEWARE INTERCEPTOR: LISTENER.onReceiveMessage: message: ${message.constructor.name}`
            // );

            applyMiddlewareHandlers(
              'onResponseBody',
              middlewareRequestHandlers.reverse(),
              (h: MiddlewareRequestHandler) => (request: any) =>
                h.onResponseBody(request),
              message,
              next
            );

            // oneMiddlewareRequestHandler
            //   .onResponseBody(message)
            //   .then(newResponse => next(newResponse))
            //   .catch(e => {
            //     throw e;
            //   });
            // next(metadata);
          },
          onReceiveStatus: function (
            status: StatusObject,
            next: (status: StatusObject) => void
          ): void {
            // logger.warn(
            //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            //   `MIDDLEWARE INTERCEPTOR: LISTENER.onReceiveStatus: status: ${
            //     status.code
            //   }, metadata: ${JSON.stringify(metadata.toJSON())}`
            // );
            // next(status);

            applyMiddlewareHandlers(
              'onResponseStatus',
              middlewareRequestHandlers.reverse(),
              (h: MiddlewareRequestHandler) => (s: StatusObject) =>
                h.onResponseStatus(s),
              status,
              next
            );

            // oneMiddlewareRequestHandler
            //   .onResponseStatus(status)
            //   .then(newStatus => next(newStatus))
            //   .catch(e => {
            //     throw e;
            //   });
          },
        };

        // oneMiddlewareRequestHandler
        //   .onRequestMetadata(metadata)
        //   .then(newMetadata => next(newMetadata, newListener))
        //   .catch(e => {
        //     throw e;
        //   });

        applyMiddlewareHandlers(
          'onRequestMetadata',
          middlewareRequestHandlers,
          (h: MiddlewareRequestHandler) => (m: Metadata) =>
            h.onRequestMetadata(m),
          metadata,
          (m: Metadata) => next(m, newListener)
        );

        // next(metadata, newListener);
      },
      sendMessage: function (message: any, next: (message: any) => void): void {
        // logger.warn(
        //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
        //   `MIDDLEWARE INTERCEPTOR: REQUESTER.sendMessage: message: ${message.constructor.name}`
        // );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // savedOutboundRequest = message;
        // savedMetadataCallback = middlewares.wrapRequest(
        //   savedOutboundMetadata,
        //   savedOutboundRequest,
        //   (metadata, request) => {
        //
        //   }
        // );

        // oneMiddlewareRequestHandler
        //   .onRequestBody(message)
        //   .then(newRequest => next(newRequest))
        //   .catch(e => {
        //     throw e;
        //   });

        applyMiddlewareHandlers(
          'onRequestBody',
          middlewareRequestHandlers,
          (h: MiddlewareRequestHandler) => (request: any) =>
            h.onRequestBody(request),
          message,
          next
        );

        //
        // next(message);
      },
    };

    // logger.warn(
    //   `MIDDLEWARE INTERCEPTOR INTERCEPTING CALL! ${options.method_definition.path}`
    // );
    // const parent = options.parent;
    // logger.warn(
    //   `MIDDLEWARE: parent: ${typeof parent}, ${JSON.stringify(parent)}`
    // );
    // if (parent instanceof ServerUnaryCall<any, any>) {
    //   logger.warn(`MIDDLEWARE INTERCEPTOR: IT'S A UNARY CALL: ${parent.re}`);
    // }
    // const parent = options.parent as ServerUnaryCall<any, any>;
    // // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // logger.warn(`MIDDLEWARE REQUEST: ${parent.request}`);
    return new InterceptingCall(nextCall(options), requester);
    // return new InterceptingCall(nextCall(options));
  };
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
  const middlewarePromise: (t: T) => Promise<T> = handlers
    .map(middlewareHandlerReduceFn)
    .reduce((previous, current) => (t: T) => {
      console.warn(`REDUCING PREVIOUS AND CURRENT: ${name}`);
      const prevMetadataPromise = previous(t);
      return prevMetadataPromise
        .then(newMetadata => current(newMetadata))
        .catch(e => {
          throw e;
        });
    });

  middlewarePromise(originalInput)
    .then(newMetadata => {
      console.log(
        `APPLY MIDDLEWARE HANDLERS; PROMISE COMPLETE, CALLING ORIGINAL NEXT FN: ${name}`
      );
      nextFn(newMetadata);
    })
    .catch(e => {
      throw e;
    });
}
