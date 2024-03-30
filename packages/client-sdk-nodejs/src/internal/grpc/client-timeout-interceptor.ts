import {InterceptingCall, Interceptor} from '@grpc/grpc-js';

export const ClientTimeoutInterceptor = (
  requestTimeoutMs: number
): Interceptor => {
  return (options, nextCall) => {
    if (!options.deadline) {
      const deadline = new Date(Date.now());
      deadline.setMilliseconds(deadline.getMilliseconds() + requestTimeoutMs);
      options.deadline = deadline;
    }
    console.log('Client timeout interceptor creating new intercepting call');
    return new InterceptingCall(nextCall(options));
  };
};
