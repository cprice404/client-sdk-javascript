import {cache} from '@gomomento/generated-types';
import {Project} from 'ts-morph';
import {RequestToLogInterfaceConverter} from '../../../../src/config/middleware/request-logging-formats';
import {common} from '@gomomento/generated-types/dist/common';

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

  it('should successfully convert a _SetBatchRequest', () => {
    const request = new cache.cache_client._SetBatchRequest();
    request.items = ['taco', 'burrito'].map(key => {
      const setRequest = new cache.cache_client._SetRequest();
      setRequest.cache_key = TEXT_ENCODER.encode(key);
      setRequest.cache_body = TEXT_ENCODER.encode('habanero');
      setRequest.ttl_milliseconds = 42;
      return setRequest;
    });
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'setBatch',
      items: [
        {key: 'taco', value: 'habanero', ttlMillis: 42},
        {key: 'burrito', value: 'habanero', ttlMillis: 42},
      ],
    });
  });

  it('should successfully convert a _SetIfRequest', () => {
    const request = new cache.cache_client._SetIfRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    request.cache_body = TEXT_ENCODER.encode('burrito');
    request.equal = new common.Equal();
    request.equal.value_to_check = TEXT_ENCODER.encode('habanero');
    request.ttl_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'setIf',
      key: 'taco',
      value: 'burrito',
      ttlMillis: 42,
      condition: 'equal',
      present: false,
      presentAndNotEqual: undefined,
      absent: false,
      equal: 'habanero',
      absentOrEqual: undefined,
      notEqual: undefined,
    });
  });

  it('should successfully convert a _SetIfNotExistsRequest', () => {
    const request = new cache.cache_client._SetIfNotExistsRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    request.cache_body = TEXT_ENCODER.encode('burrito');
    request.ttl_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'setIfNotExists',
      key: 'taco',
      value: 'burrito',
      ttlMillis: 42,
    });
  });

  it('should successfully convert a _KeysExistRequest', () => {
    const request = new cache.cache_client._KeysExistRequest();
    request.cache_keys = ['taco', 'burrito'].map(key =>
      TEXT_ENCODER.encode(key)
    );
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'keysExist',
      keys: ['taco', 'burrito'],
    });
  });

  it('should successfully convert a _IncrementRequest', () => {
    const request = new cache.cache_client._IncrementRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    request.amount = 41;
    request.ttl_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'increment',
      key: 'taco',
      amount: 41,
      ttlMillis: 42,
    });
  });

  it('should successfully convert a _UpdateTtlRequest', () => {
    const request = new cache.cache_client._UpdateTtlRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    request.increase_to_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'updateTtl',
      key: 'taco',
      increaseToMillis: 42,
      decreaseToMillis: 0,
      overwriteToMillis: 0,
    });
  });

  it('should successfully convert a _ItemGetTtlRequest', () => {
    const request = new cache.cache_client._ItemGetTtlRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'itemGetTtl',
      key: 'taco',
    });
  });

  it('should successfully convert a _ItemGetTypeRequest', () => {
    const request = new cache.cache_client._ItemGetTypeRequest();
    request.cache_key = TEXT_ENCODER.encode('taco');
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'itemGetType',
      key: 'taco',
    });
  });

  it('should successfully convert a _DictionaryGetRequest', () => {
    const request = new cache.cache_client._DictionaryGetRequest();
    request.dictionary_name = TEXT_ENCODER.encode('taco');
    request.fields = ['burrito', 'habanero'].map(field =>
      TEXT_ENCODER.encode(field)
    );
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'dictionaryGet',
      dictionaryName: 'taco',
      fields: ['burrito', 'habanero'],
    });
  });

  it('should successfully convert a _DictionaryFetchRequest', () => {
    const request = new cache.cache_client._DictionaryFetchRequest();
    request.dictionary_name = TEXT_ENCODER.encode('taco');
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'dictionaryFetch',
      dictionaryName: 'taco',
    });
  });

  it('should successfully convert a _DictionarySetRequest', () => {
    const request = new cache.cache_client._DictionarySetRequest();
    request.dictionary_name = TEXT_ENCODER.encode('taco');
    request.items = ['burrito', 'habanero'].map(key => {
      return new cache.cache_client._DictionaryFieldValuePair({
        field: TEXT_ENCODER.encode(key),
        value: TEXT_ENCODER.encode('jalapeno'),
      });
    });
    request.refresh_ttl = true;
    request.ttl_milliseconds = 42;
    const converter = RequestToLogInterfaceConverter.get(
      request.constructor.name
    );
    expect(converter).toBeDefined();
    expect(converter?.(request)).toEqual({
      requestType: 'dictionarySet',
      dictionaryName: 'taco',
      items: [
        {field: 'burrito', value: 'jalapeno'},
        {field: 'habanero', value: 'jalapeno'},
      ],
      refreshTtl: true,
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
