import {
  StaticGrpcConfiguration,
  StaticTransportStrategy,
} from '../../src/config/transport/transport-strategy';
import {StringMomentoTokenProvider} from '../../src/auth/credential-provider';

const testToken =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmb29AYmFyLmNvbSIsImNwIjoiY29udHJvbC1wbGFuZS1lbmRwb2ludC5iYXIuY29tIiwiYyI6ImNhY2hlLWVuZHBvaW50LmJhci5jb20ifQo.rtxfu4miBHQ1uptWJ2x3UiAwwJYcMeYIkkpXxUno_wIavg4h6YJStcbxk32NDBbmJkJS7mUw6MsvJNWaxfdPOw';
const testControlEndpoint = 'foo';

describe('StringMomentoTokenProvider', () => {
  it('parses a valid token', () => {
    const authProvider = new StringMomentoTokenProvider(testToken);
    expect(authProvider.getAuthToken()).toEqual(testToken);
    expect(authProvider.getCacheEndpoint()).toEqual(testControlEndpoint);
  });
  const testDeadlineMillis = 90210;
  const testMaxSessionMemoryMb = 90211;
  const testGrpcConfiguration = new StaticGrpcConfiguration({
    deadlineMillis: testDeadlineMillis,
    maxSessionMemoryMb: testMaxSessionMemoryMb,
  });

  const testMaxIdleMillis = 90212;
  const testTransportStrategy = new StaticTransportStrategy({
    grpcConfiguration: testGrpcConfiguration,
    maxIdleMillis: testMaxIdleMillis,
  });

  it('should support overriding grpc config', () => {
    const newDeadlineMillis = 42;
    const newMaxSessionMemoryMb = 43;
    const newGrpcConfig = new StaticGrpcConfiguration({
      deadlineMillis: newDeadlineMillis,
      maxSessionMemoryMb: newMaxSessionMemoryMb,
    });
    const strategyWithNewGrpcConfig =
      testTransportStrategy.withGrpcConfig(newGrpcConfig);
    expect(strategyWithNewGrpcConfig.getGrpcConfig()).toEqual(newGrpcConfig);
    expect(strategyWithNewGrpcConfig.getMaxIdleMillis()).toEqual(
      testMaxIdleMillis
    );
  });
});
