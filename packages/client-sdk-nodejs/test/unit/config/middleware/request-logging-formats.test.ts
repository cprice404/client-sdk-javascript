import {cache} from '@gomomento/generated-types';
import {Project} from 'ts-morph';
import {RequestToLogInterfaceConverter} from '../../../../src/config/middleware/request-logging-formats';

const TEXT_ENCODER = new TextEncoder();

describe('request-logging-formats.ts', () => {
  it('should successfully convert a _GetRequest', () => {
    const request = new cache.cache_client._GetRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({requestType: 'get', key: 'taco'});
  });

  it('should successfully convert a _GetBatchRequest', () => {
    const request = new cache.cache_client._GetBatchRequest();
    request.items = ['taco', 'burrito'].map(key => {
      const getRequest = new cache.cache_client._GetRequest();
      getRequest.cache_key = TEXT_ENCODER.encode(key);
      return getRequest;
    });
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'getBatch',
      keys: ['taco', 'burrito'],
    });
  });

  it('should successfully convert a _DeleteRequest', () => {
    const request = new cache.cache_client._DeleteRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({requestType: 'delete', key: 'taco'});
  });

  it('should successfully convert a _SetRequest', () => {
    const request = new cache.cache_client._SetRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    request.cache_body = TEXT_ENCODER.encode('burrito');
    request.ttl_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'set',
      key: 'taco',
      value: 'burrito',
      ttlMillis: 42,
    });
  });

  it('should have a converter for all known cache request types', () => {
    const project = new Project();
    const cacheClientProtosSourceFile = project.addSourceFileAtPath(
      './node_modules/@gomomento/generated-types/dist/cacheclient.d.ts'
    );
    const classes = cacheClientProtosSourceFile
      .getModule('cache_client')
      ?.getClasses();

    if (classes === undefined) {
      throw new Error('Unable to get the classes for cache_client');
    }

    const requestClasses = classes
      .filter(c => c.getName()?.endsWith('Request'))
      .map(c => c.getName() as string);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(
      `ALL THE REQUEST CLASSES (${
        requestClasses.length
      }): ${requestClasses.join(',')}`
    );

    for (const rc of requestClasses) {
      if (!RequestToLogInterfaceConverter.has(rc)) {
        throw new Error(
          `Request class ${rc} not found in RequestToLogInterfaceConverter`
        );
      }
    }

    // const allTheValues = Object.values(cache.cache_client);
    // for (const v of allTheValues) {
    //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    //   console.log(`VALUE: ${v.type}`);
    // }
    // console.log(`ALL THE VALUES: ${allTheValues.join(',')}`);
    expect(true).toEqual(false);
  });
});
