import {cache} from '@gomomento/generated-types';
import {Project} from 'ts-morph';
import {RequestToLogInterfaceConverter} from '../../../../src/config/middleware/request-logging-formats';
import {common} from '@gomomento/generated-types/dist/common';

const TEXT_ENCODER = new TextEncoder();

describe('request-logging-formats.ts', () => {
  describe('when converting cache requests', () => {
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
      expect(converter?.(request)).toEqual({
        requestType: 'delete',
        key: 'taco',
      });
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

    it('should successfully convert a _DictionaryIncrementRequest', () => {
      const request = new cache.cache_client._DictionaryIncrementRequest();
      request.dictionary_name = TEXT_ENCODER.encode('taco');
      request.field = TEXT_ENCODER.encode('burrito');
      request.amount = 41;
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'dictionaryIncrement',
        dictionaryName: 'taco',
        field: 'burrito',
        amount: 41,
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _DictionaryDeleteRequest', () => {
      const request = new cache.cache_client._DictionaryDeleteRequest();
      request.dictionary_name = TEXT_ENCODER.encode('taco');
      request.some = new cache.cache_client._DictionaryDeleteRequest.Some({
        fields: ['burrito', 'habanero'].map(field =>
          TEXT_ENCODER.encode(field)
        ),
      });
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'dictionaryDelete',
        dictionaryName: 'taco',
        fields: ['burrito', 'habanero'],
      });
    });

    it('should successfully convert a _DictionaryLengthRequest', () => {
      const request = new cache.cache_client._DictionaryLengthRequest();
      request.dictionary_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'dictionaryLength',
        dictionaryName: 'taco',
      });
    });

    it('should successfully convert a _SetFetchRequest', () => {
      const request = new cache.cache_client._SetFetchRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setFetch',
        setName: 'taco',
      });
    });

    it('should successfully convert a _SetSampleRequest', () => {
      const request = new cache.cache_client._SetSampleRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      request.limit = 42;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setSample',
        setName: 'taco',
        limit: 42,
      });
    });

    it('should successfully convert a _SetUnionRequest', () => {
      const request = new cache.cache_client._SetUnionRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      request.elements = ['burrito', 'habanero'].map(element =>
        TEXT_ENCODER.encode(element)
      );
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setUnion',
        setName: 'taco',
        elements: ['burrito', 'habanero'],
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _SetDifferenceRequest', () => {
      const request = new cache.cache_client._SetDifferenceRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      request.subtrahend =
        new cache.cache_client._SetDifferenceRequest._Subtrahend({
          set: new cache.cache_client._SetDifferenceRequest._Subtrahend._Set({
            elements: ['burrito', 'habanero'].map(element =>
              TEXT_ENCODER.encode(element)
            ),
          }),
        });

      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setDifference',
        setName: 'taco',
        action: 'subtrahend_set',
        elements: ['burrito', 'habanero'],
      });
    });

    it('should successfully convert a _SetContainsRequest', () => {
      const request = new cache.cache_client._SetContainsRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      request.elements = ['burrito', 'habanero'].map(element =>
        TEXT_ENCODER.encode(element)
      );
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setContains',
        setName: 'taco',
        elements: ['burrito', 'habanero'],
      });
    });

    it('should successfully convert a _SetLengthRequest', () => {
      const request = new cache.cache_client._SetLengthRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setLength',
        setName: 'taco',
      });
    });

    it('should successfully convert a _SetPopRequest', () => {
      const request = new cache.cache_client._SetPopRequest();
      request.set_name = TEXT_ENCODER.encode('taco');
      request.count = 42;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'setPop',
        setName: 'taco',
        count: 42,
      });
    });

    it('should successfully convert a _ListConcatenateFrontRequest', () => {
      const request = new cache.cache_client._ListConcatenateFrontRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.values = ['burrito', 'habanero'].map(element =>
        TEXT_ENCODER.encode(element)
      );
      request.truncate_back_to_size = 41;
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listConcatenateFront',
        listName: 'taco',
        values: ['burrito', 'habanero'],
        truncateBackToSize: 41,
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _ListConcatenateBackRequest', () => {
      const request = new cache.cache_client._ListConcatenateBackRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.values = ['burrito', 'habanero'].map(element =>
        TEXT_ENCODER.encode(element)
      );
      request.truncate_front_to_size = 41;
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listConcatenateBack',
        listName: 'taco',
        values: ['burrito', 'habanero'],
        truncateFrontToSize: 41,
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _ListPushFrontRequest', () => {
      const request = new cache.cache_client._ListPushFrontRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.value = TEXT_ENCODER.encode('burrito');
      request.truncate_back_to_size = 41;
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listPushFront',
        listName: 'taco',
        value: 'burrito',
        truncateBackToSize: 41,
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _ListPushBackRequest', () => {
      const request = new cache.cache_client._ListPushBackRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.value = TEXT_ENCODER.encode('burrito');
      request.truncate_front_to_size = 41;
      request.ttl_milliseconds = 42;
      request.refresh_ttl = true;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listPushBack',
        listName: 'taco',
        value: 'burrito',
        truncateFrontToSize: 41,
        ttlMillis: 42,
        refreshTtl: true,
      });
    });

    it('should successfully convert a _ListPopFrontRequest', () => {
      const request = new cache.cache_client._ListPopFrontRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listPopFront',
        listName: 'taco',
      });
    });

    it('should successfully convert a _ListPopBackRequest', () => {
      const request = new cache.cache_client._ListPopBackRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listPopBack',
        listName: 'taco',
      });
    });

    it('should successfully convert a _ListRemoveRequest', () => {
      const request = new cache.cache_client._ListRemoveRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.all_elements_with_value = TEXT_ENCODER.encode('burrito');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listRemove',
        listName: 'taco',
        value: 'burrito',
      });
    });

    it('should successfully convert a _ListFetchRequest', () => {
      const request = new cache.cache_client._ListFetchRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.inclusive_start = 1;
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listFetch',
        listName: 'taco',
        inclusiveStart: 1,
        exclusiveEnd: 0,
      });
    });

    it('should successfully convert a _ListEraseRequest', () => {
      const request = new cache.cache_client._ListEraseRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      request.some = new cache.cache_client._ListEraseRequest._ListRanges({
        ranges: [
          new cache.cache_client._ListRange({
            begin_index: 1,
            count: 2,
          }),
        ],
      });
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listErase',
        listName: 'taco',
        all: false,
        some: [{beginIndex: 1, count: 2}],
      });
    });

    it('should successfully convert a _ListLengthRequest', () => {
      const request = new cache.cache_client._ListLengthRequest();
      request.list_name = TEXT_ENCODER.encode('taco');
      const converter = RequestToLogInterfaceConverter.get(
        request.constructor.name
      );
      expect(converter).toBeDefined();
      expect(converter?.(request)).toEqual({
        requestType: 'listLength',
        listName: 'taco',
      });
    });
  });

  describe('supported cache request types', () => {
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

      expect(true).toEqual(false);
    });
  });
});
