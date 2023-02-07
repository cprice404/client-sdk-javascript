import {InterceptingCall, Interceptor, InterceptorOptions} from '@grpc/grpc-js';
import {NextCall} from '@grpc/grpc-js/build/src/client-interceptors';
import {Middleware} from '../config/middleware/middleware';
import {MomentoLoggerFactory} from '../config/logging/momento-logger';

export function middlewaresInterceptor(
  loggerFactory: MomentoLoggerFactory,
  middlewares: Middleware[]
): Interceptor {
  const logger = loggerFactory.getLogger('MiddlewaresInterceptor');
  return (options: InterceptorOptions, nextCall: NextCall) => {
    logger.warn(
      `MIDDLEWARE INTERCEPTOR INTERCEPTING CALL! ${options.method_definition.path}`
    );
    const parent = options.parent;
    logger.warn(
      `MIDDLEWARE: parent: ${typeof parent}, ${JSON.stringify(parent)}`
    );
    // if (parent instanceof ServerUnaryCall<any, any>) {
    //   logger.warn(`MIDDLEWARE INTERCEPTOR: IT'S A UNARY CALL: ${parent.re}`);
    // }
    // const parent = options.parent as ServerUnaryCall<any, any>;
    // // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // logger.warn(`MIDDLEWARE REQUEST: ${parent.request}`);
    return new InterceptingCall(nextCall(options));
  };
}
