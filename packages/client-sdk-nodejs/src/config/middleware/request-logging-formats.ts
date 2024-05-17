import {cache} from '@gomomento/generated-types';
import {SetBatchItem} from '@gomomento/sdk-core';

const TEXT_DECODER = new TextDecoder();

// TODO: bytes will not always be convertible to string
function convertBytesToString(bytes: Uint8Array) {
  return TEXT_DECODER.decode(bytes);
}

export function convertSingleKeyRequest(
  requestType: string,
  key: Uint8Array
): RequestSingleKeyLoggingFormat {
  return {
    requestType: requestType,
    key: convertBytesToString(key),
  };
}

interface RequestLogInterfaceBase {
  requestType: string;
}

interface WriteRequestLogInterfaceBase extends RequestLogInterfaceBase {
  ttlMillis: number;
}

interface CollectionWriteRequestLogInterfaceBase
  extends WriteRequestLogInterfaceBase {
  refreshTtl: boolean;
}

// Current used for GetBatch and KeysExist requests
interface RequestMultipleKeysLoggingFormat extends RequestLogInterfaceBase {
  keys: string[];
}

// Currently used for Get, Delete, ItemGetTtl, and ItemGetType requests
interface RequestSingleKeyLoggingFormat extends RequestLogInterfaceBase {
  key: string;
}

interface RequestToLogInterfaceConverterFn<
  TRequest,
  TLog extends RequestLogInterfaceBase
> {
  (request: TRequest): TLog;
}

const convertGetRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._GetRequest,
  RequestSingleKeyLoggingFormat
> = (request: cache.cache_client._GetRequest) => {
  return convertSingleKeyRequest('get', request.cache_key);
};

const convertGetBatchRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._GetBatchRequest,
  RequestMultipleKeysLoggingFormat
> = (request: cache.cache_client._GetBatchRequest) => {
  return {
    requestType: 'getBatch',
    keys: request.items.map(item => convertBytesToString(item.cache_key)),
  };
};

const convertDeleteRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DeleteRequest,
  RequestSingleKeyLoggingFormat
> = (request: cache.cache_client._DeleteRequest) => {
  return convertSingleKeyRequest('delete', request.cache_key);
};

interface SetRequestLoggingFormat extends WriteRequestLogInterfaceBase {
  key: string;
  value: string;
}

const convertSetRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetRequest,
  SetRequestLoggingFormat
> = (request: cache.cache_client._SetRequest) => {
  return {
    requestType: 'set',
    key: convertBytesToString(request.cache_key),
    value: convertBytesToString(request.cache_body),
    ttlMillis: request.ttl_milliseconds,
  };
};

interface SetBatchRequestLoggingFormat extends RequestLogInterfaceBase {
  items: SetBatchItem[];
}

const convertSetBatchRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetBatchRequest,
  SetBatchRequestLoggingFormat
> = (request: cache.cache_client._SetBatchRequest) => {
  return {
    requestType: 'setBatch',
    items: request.items.map(item => {
      return {
        key: convertBytesToString(item.cache_key),
        value: convertBytesToString(item.cache_body),
        ttlMillis: item.ttl_milliseconds,
      };
    }),
  };
};

interface SetIfRequestLoggingFormat extends WriteRequestLogInterfaceBase {
  key: string;
  value: string;
  condition: string;
  present: boolean;
  presentAndNotEqual: string | undefined;
  absent: boolean;
  equal: string | undefined;
  absentOrEqual: string | undefined;
  notEqual: string | undefined;
}

const convertSetIfRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetIfRequest,
  SetIfRequestLoggingFormat
> = (request: cache.cache_client._SetIfRequest) => {
  return {
    requestType: 'setIf',
    key: convertBytesToString(request.cache_key),
    value: convertBytesToString(request.cache_body),
    ttlMillis: request.ttl_milliseconds,
    condition: request.condition,
    present: request.present !== undefined,
    presentAndNotEqual: request.present_and_not_equal
      ? convertBytesToString(request.present_and_not_equal.value_to_check)
      : undefined,
    absent: request.absent !== undefined,
    equal: request.equal
      ? convertBytesToString(request.equal.value_to_check)
      : undefined,
    absentOrEqual: request.absent_or_equal
      ? convertBytesToString(request.absent_or_equal.value_to_check)
      : undefined,
    notEqual: request.not_equal
      ? convertBytesToString(request.not_equal.value_to_check)
      : undefined,
  };
};

const convertSetIfNotExistsRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetIfNotExistsRequest,
  SetRequestLoggingFormat
> = (request: cache.cache_client._SetIfNotExistsRequest) => {
  return {
    requestType: 'setIfNotExists',
    key: convertBytesToString(request.cache_key),
    value: convertBytesToString(request.cache_body),
    ttlMillis: request.ttl_milliseconds,
  };
};

const convertKeysExistRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._KeysExistRequest,
  RequestMultipleKeysLoggingFormat
> = (request: cache.cache_client._KeysExistRequest) => {
  return {
    requestType: 'keysExist',
    keys: request.cache_keys.map(key => convertBytesToString(key)),
  };
};

interface IncrementRequestLoggingFormat extends WriteRequestLogInterfaceBase {
  key: string;
  amount: number;
}

const convertIncrementRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._IncrementRequest,
  IncrementRequestLoggingFormat
> = (request: cache.cache_client._IncrementRequest) => {
  return {
    requestType: 'increment',
    key: convertBytesToString(request.cache_key),
    amount: request.amount,
    ttlMillis: request.ttl_milliseconds,
  };
};

interface UpdateTtlRequestLoggingFormat extends RequestLogInterfaceBase {
  key: string;
  increaseToMillis: number;
  decreaseToMillis: number;
  overwriteToMillis: number;
}

const convertUpdateTtlRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._UpdateTtlRequest,
  UpdateTtlRequestLoggingFormat
> = (request: cache.cache_client._UpdateTtlRequest) => {
  return {
    requestType: 'updateTtl',
    key: convertBytesToString(request.cache_key),
    increaseToMillis: request.increase_to_milliseconds,
    decreaseToMillis: request.decrease_to_milliseconds,
    overwriteToMillis: request.overwrite_to_milliseconds,
  };
};

const convertItemGetTtlRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ItemGetTtlRequest,
  RequestSingleKeyLoggingFormat
> = (request: cache.cache_client._ItemGetTtlRequest) => {
  return convertSingleKeyRequest('itemGetTtl', request.cache_key);
};

const convertItemGetTypeRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ItemGetTypeRequest,
  RequestSingleKeyLoggingFormat
> = (request: cache.cache_client._ItemGetTypeRequest) => {
  return convertSingleKeyRequest('itemGetType', request.cache_key);
};

interface DictionaryRequestLoggingFormat extends RequestLogInterfaceBase {
  dictionaryName: string;
}

interface DictionaryGetRequestLoggingFormat
  extends DictionaryRequestLoggingFormat {
  fields: string[];
}

const convertDictionaryGetRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionaryGetRequest,
  DictionaryGetRequestLoggingFormat
> = (request: cache.cache_client._DictionaryGetRequest) => {
  return {
    requestType: 'dictionaryGet',
    dictionaryName: convertBytesToString(request.dictionary_name),
    fields: request.fields.map(field => convertBytesToString(field)),
  };
};

const convertDictionaryFetchRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionaryFetchRequest,
  DictionaryRequestLoggingFormat
> = (request: cache.cache_client._DictionaryFetchRequest) => {
  return {
    requestType: 'dictionaryFetch',
    dictionaryName: convertBytesToString(request.dictionary_name),
  };
};

interface DictionarySetRequestLoggingFormat
  extends DictionaryRequestLoggingFormat,
    CollectionWriteRequestLogInterfaceBase {
  items: {field: string; value: string}[];
}

const convertDictionarySetRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionarySetRequest,
  DictionarySetRequestLoggingFormat
> = (request: cache.cache_client._DictionarySetRequest) => {
  return {
    requestType: 'dictionarySet',
    dictionaryName: convertBytesToString(request.dictionary_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    items: request.items.map(item => {
      return {
        field: convertBytesToString(item.field),
        value: convertBytesToString(item.value),
      };
    }),
  };
};

interface DictionaryIncrementRequestLoggingFormat
  extends DictionaryRequestLoggingFormat,
    CollectionWriteRequestLogInterfaceBase {
  field: string;
  amount: number;
}

const convertDictionaryIncrementRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionaryIncrementRequest,
  DictionaryIncrementRequestLoggingFormat
> = (request: cache.cache_client._DictionaryIncrementRequest) => {
  return {
    requestType: 'dictionaryIncrement',
    dictionaryName: convertBytesToString(request.dictionary_name),
    field: convertBytesToString(request.field),
    amount: request.amount,
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
  };
};

interface DictionaryDeleteRequestLoggingFormat
  extends DictionaryRequestLoggingFormat {
  fields: string[];
}

const convertDictionaryDeleteRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionaryDeleteRequest,
  DictionaryDeleteRequestLoggingFormat
> = (request: cache.cache_client._DictionaryDeleteRequest) => {
  return {
    requestType: 'dictionaryDelete',
    dictionaryName: convertBytesToString(request.dictionary_name),
    fields: request.some.fields.map(field => convertBytesToString(field)),
  };
};

const convertDictionaryLengthRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._DictionaryLengthRequest,
  DictionaryRequestLoggingFormat
> = (request: cache.cache_client._DictionaryLengthRequest) => {
  return {
    requestType: 'dictionaryLength',
    dictionaryName: convertBytesToString(request.dictionary_name),
  };
};

interface SetCollectionRequestLoggingFormat extends RequestLogInterfaceBase {
  setName: string;
}

const convertSetFetchRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetFetchRequest,
  SetCollectionRequestLoggingFormat
> = (request: cache.cache_client._SetFetchRequest) => {
  return {
    requestType: 'setFetch',
    setName: convertBytesToString(request.set_name),
  };
};

interface SetSampleRequestLoggingFormat
  extends SetCollectionRequestLoggingFormat {
  limit: number;
}

const convertSetSampleRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetSampleRequest,
  SetSampleRequestLoggingFormat
> = (request: cache.cache_client._SetSampleRequest) => {
  return {
    requestType: 'setSample',
    setName: convertBytesToString(request.set_name),
    limit: request.limit,
  };
};

interface SetUnionRequestLoggingFormat
  extends SetCollectionRequestLoggingFormat,
    CollectionWriteRequestLogInterfaceBase {
  elements: string[];
}

const convertSetUnionRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetUnionRequest,
  SetUnionRequestLoggingFormat
> = (request: cache.cache_client._SetUnionRequest) => {
  return {
    requestType: 'setUnion',
    setName: convertBytesToString(request.set_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    elements: request.elements.map(element => convertBytesToString(element)),
  };
};

interface SetDifferenceRequestLoggingFormat
  extends SetCollectionRequestLoggingFormat {
  action: 'minuend' | 'subtrahend_set' | 'subtrahend_identity';
  elements?: string[];
}

const convertSetDifferenceRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetDifferenceRequest,
  SetDifferenceRequestLoggingFormat
> = (request: cache.cache_client._SetDifferenceRequest) => {
  return {
    requestType: 'setDifference',
    setName: convertBytesToString(request.set_name),
    action: request.minuend
      ? 'minuend'
      : request.subtrahend.set
      ? 'subtrahend_set'
      : 'subtrahend_identity',
    elements: request.minuend
      ? request.minuend.elements.map(element => convertBytesToString(element))
      : request.subtrahend.set
      ? request.subtrahend.set.elements.map(element =>
          convertBytesToString(element)
        )
      : undefined,
  };
};

interface SetContainsRequestLoggingFormat
  extends SetCollectionRequestLoggingFormat {
  elements: string[];
}

const convertSetContainsRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetContainsRequest,
  SetContainsRequestLoggingFormat
> = (request: cache.cache_client._SetContainsRequest) => {
  return {
    requestType: 'setContains',
    setName: convertBytesToString(request.set_name),
    elements: request.elements.map(element => convertBytesToString(element)),
  };
};

const convertSetLengthRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetLengthRequest,
  SetCollectionRequestLoggingFormat
> = (request: cache.cache_client._SetLengthRequest) => {
  return {
    requestType: 'setLength',
    setName: convertBytesToString(request.set_name),
  };
};

interface SetPopRequestLoggingFormat extends SetCollectionRequestLoggingFormat {
  count: number;
}

const convertSetPopRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._SetPopRequest,
  SetPopRequestLoggingFormat
> = (request: cache.cache_client._SetPopRequest) => {
  return {
    requestType: 'setPop',
    setName: convertBytesToString(request.set_name),
    count: request.count,
  };
};

interface ListRequestLoggingFormat extends RequestLogInterfaceBase {
  listName: string;
}

interface ListConcatenateFrontRequestLoggingFormat
  extends ListRequestLoggingFormat,
    WriteRequestLogInterfaceBase {
  truncateBackToSize: number;
  values: string[];
}

const convertListConcatenateFrontRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListConcatenateFrontRequest,
  ListConcatenateFrontRequestLoggingFormat
> = (request: cache.cache_client._ListConcatenateFrontRequest) => {
  return {
    requestType: 'listConcatenateFront',
    listName: convertBytesToString(request.list_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    truncateBackToSize: request.truncate_back_to_size,
    values: request.values.map(value => convertBytesToString(value)),
  };
};

interface ListConcatenateBackRequestLoggingFormat
  extends ListRequestLoggingFormat,
    WriteRequestLogInterfaceBase {
  truncateFrontToSize: number;
  values: string[];
}

const convertListConcatenateBackRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListConcatenateBackRequest,
  ListConcatenateBackRequestLoggingFormat
> = (request: cache.cache_client._ListConcatenateBackRequest) => {
  return {
    requestType: 'listConcatenateBack',
    listName: convertBytesToString(request.list_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    truncateFrontToSize: request.truncate_front_to_size,
    values: request.values.map(value => convertBytesToString(value)),
  };
};

interface ListPushFrontRequestLoggingFormat
  extends ListRequestLoggingFormat,
    WriteRequestLogInterfaceBase {
  truncateBackToSize: number;
  value: string;
}

const convertListPushFrontRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListPushFrontRequest,
  ListPushFrontRequestLoggingFormat
> = (request: cache.cache_client._ListPushFrontRequest) => {
  return {
    requestType: 'listPushFront',
    listName: convertBytesToString(request.list_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    truncateBackToSize: request.truncate_back_to_size,
    value: convertBytesToString(request.value),
  };
};

interface ListPushBackRequestLoggingFormat
  extends ListRequestLoggingFormat,
    WriteRequestLogInterfaceBase {
  truncateFrontToSize: number;
  value: string;
}

const convertListPushBackRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListPushBackRequest,
  ListPushBackRequestLoggingFormat
> = (request: cache.cache_client._ListPushBackRequest) => {
  return {
    requestType: 'listPushBack',
    listName: convertBytesToString(request.list_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    truncateFrontToSize: request.truncate_front_to_size,
    value: convertBytesToString(request.value),
  };
};

const convertListPopFrontRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListPopFrontRequest,
  ListRequestLoggingFormat
> = (request: cache.cache_client._ListPopFrontRequest) => {
  return {
    requestType: 'listPopFront',
    listName: convertBytesToString(request.list_name),
  };
};

const convertListPopBackRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListPopBackRequest,
  ListRequestLoggingFormat
> = (request: cache.cache_client._ListPopBackRequest) => {
  return {
    requestType: 'listPopBack',
    listName: convertBytesToString(request.list_name),
  };
};

interface ListRemoveValueRequestLoggingFormat extends ListRequestLoggingFormat {
  value: string;
}

const convertListRemoveRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListRemoveRequest,
  ListRemoveValueRequestLoggingFormat
> = (request: cache.cache_client._ListRemoveRequest) => {
  return {
    requestType: 'listRemove',
    listName: convertBytesToString(request.list_name),
    value: convertBytesToString(request.all_elements_with_value),
  };
};

interface ListFetchRequestLoggingFormat extends ListRequestLoggingFormat {
  inclusiveStart: number;
  exclusiveEnd: number;
}

const convertListFetchRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListFetchRequest,
  ListFetchRequestLoggingFormat
> = (request: cache.cache_client._ListFetchRequest) => {
  return {
    requestType: 'listFetch',
    listName: convertBytesToString(request.list_name),
    inclusiveStart: request.inclusive_start,
    exclusiveEnd: request.exclusive_end,
  };
};

interface ListEraseRequestLoggingFormat extends ListRequestLoggingFormat {
  all: boolean;
  some: {beginIndex: number; count: number}[];
}

const convertListEraseRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListEraseRequest,
  ListEraseRequestLoggingFormat
> = (request: cache.cache_client._ListEraseRequest) => {
  return {
    requestType: 'listErase',
    listName: convertBytesToString(request.list_name),
    all: request.all !== undefined,
    some: request.some.ranges.map(range => {
      return {
        beginIndex: range.begin_index,
        count: range.count,
      };
    }),
  };
};

interface ListRetainRequestLoggingFormat
  extends ListRequestLoggingFormat,
    WriteRequestLogInterfaceBase {
  inclusiveStart: number;
  exclusiveEnd: number;
}

const convertListRetainRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListRetainRequest,
  ListRetainRequestLoggingFormat
> = (request: cache.cache_client._ListRetainRequest) => {
  return {
    requestType: 'listRetain',
    listName: convertBytesToString(request.list_name),
    ttlMillis: request.ttl_milliseconds,
    refreshTtl: request.refresh_ttl,
    inclusiveStart: request.inclusive_start,
    exclusiveEnd: request.exclusive_end,
  };
};

const convertListLengthRequest: RequestToLogInterfaceConverterFn<
  cache.cache_client._ListLengthRequest,
  ListRequestLoggingFormat
> = (request: cache.cache_client._ListLengthRequest) => {
  return {
    requestType: 'listLength',
    listName: convertBytesToString(request.list_name),
  };
};

export const RequestToLogInterfaceConverter = new Map<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RequestToLogInterfaceConverterFn<any, any>
>([
  ['_GetRequest', convertGetRequest],
  ['_GetBatchRequest', convertGetBatchRequest],
  ['_DeleteRequest', convertDeleteRequest],
  ['_SetRequest', convertSetRequest],
  ['_SetBatchRequest', convertSetBatchRequest],
  ['_SetIfRequest', convertSetIfRequest],
  ['_SetIfNotExistsRequest', convertSetIfNotExistsRequest],
  ['_KeysExistRequest', convertKeysExistRequest],
  ['_IncrementRequest', convertIncrementRequest],
  ['_UpdateTtlRequest', convertUpdateTtlRequest],
  ['_ItemGetTtlRequest', convertItemGetTtlRequest],
  ['_ItemGetTypeRequest', convertItemGetTypeRequest],
  ['_DictionaryGetRequest', convertDictionaryGetRequest],
  ['_DictionaryFetchRequest', convertDictionaryFetchRequest],
  ['_DictionarySetRequest', convertDictionarySetRequest],
  ['_DictionaryIncrementRequest', convertDictionaryIncrementRequest],
  ['_DictionaryDeleteRequest', convertDictionaryDeleteRequest],
  ['_DictionaryLengthRequest', convertDictionaryLengthRequest],
  ['_SetFetchRequest', convertSetFetchRequest],
  ['_SetSampleRequest', convertSetSampleRequest],
  ['_SetUnionRequest', convertSetUnionRequest],
  ['_SetDifferenceRequest', convertSetDifferenceRequest],
  ['_SetContainsRequest', convertSetContainsRequest],
  ['_SetLengthRequest', convertSetLengthRequest],
  ['_SetPopRequest', convertSetPopRequest],
  ['_ListConcatenateFrontRequest', convertListConcatenateFrontRequest],
  ['_ListConcatenateBackRequest', convertListConcatenateBackRequest],
  ['_ListPushFrontRequest', convertListPushFrontRequest],
  ['_ListPushBackRequest', convertListPushBackRequest],
  ['_ListPopFrontRequest', convertListPopFrontRequest],
  ['_ListPopBackRequest', convertListPopBackRequest],
  ['_ListRemoveRequest', convertListRemoveRequest],
  ['_ListFetchRequest', convertListFetchRequest],
  ['_ListEraseRequest', convertListEraseRequest],
  ['_ListRetainRequest', convertListRetainRequest],
  ['_ListLengthRequest', convertListLengthRequest],
]);

// interface SortedSetPutRequestLoggingFormat {
//   set_name: string;
//   elements: {value: string; score: number}[];
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
// }
//
// export function convertSortedSetPutRequest(
//   request: cache.cache_client._SortedSetPutRequest
// ): SortedSetPutRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     elements: request.elements.map(item => {
//       return {
//         value: convertBytesToString(item.value),
//         score: item.score,
//       };
//     }),
//   };
// }
//
// interface SortedSetFetchRequestLoggingFormat {
//   set_name: string;
//   order: 'ascending' | 'descending'; // enum with 0 = ascending, 1 = descending
//   by_score?: {
//     min_score: number | string;
//     min_score_exclusive?: boolean;
//     max_score: number | string;
//     max_score_exclusive?: boolean;
//   };
//   by_index?: {
//     inclusive_start_index: number | string;
//     exclusive_end_index: number | string;
//   };
// }
//
// export function convertSortedSetFetchRequest(
//   request: cache.cache_client._SortedSetFetchRequest
// ): SortedSetFetchRequestLoggingFormat {
//   const by_score = request.by_score
//     ? {
//         min_score: request.by_score?.unbounded_min
//           ? 'unbounded'
//           : request.by_score?.min_score.score,
//         min_score_exclusive: request.by_score?.min_score?.exclusive,
//         max_score: request.by_score?.unbounded_max
//           ? 'unbounded'
//           : request.by_score?.max_score.score,
//         max_score_exclusive: request.by_score?.max_score?.exclusive,
//       }
//     : undefined;
//
//   const by_index = request.by_index
//     ? {
//         inclusive_start_index: request.by_index.unbounded_start
//           ? 'unbounded'
//           : request.by_index?.inclusive_start_index,
//         exclusive_end_index: request.by_index.unbounded_end
//           ? 'unbounded'
//           : request.by_index?.exclusive_end_index,
//       }
//     : undefined;
//
//   return {
//     set_name: convertBytesToString(request.set_name),
//     order: request.order ? 'descending' : 'ascending',
//     by_score,
//     by_index,
//   };
// }
//
// interface SortedSetGetScoreRequestLoggingFormat {
//   set_name: string;
//   values: string[];
// }
//
// export function convertSortedSetGetScoreRequest(
//   request: cache.cache_client._SortedSetGetScoreRequest
// ): SortedSetGetScoreRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     values: request.values.map(value => convertBytesToString(value)),
//   };
// }
//
// interface SortedSetRemoveRequestLoggingFormat {
//   set_name: string;
//   values: string[] | 'all';
// }
//
// export function convertSortedSetRemoveRequest(
//   request: cache.cache_client._SortedSetRemoveRequest
// ): SortedSetRemoveRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     values: request.all
//       ? 'all'
//       : request.some.values.map(value => convertBytesToString(value)),
//   };
// }
//
// interface SortedSetIncrementRequestLoggingFormat {
//   set_name: string;
//   value: string;
//   amount: number;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
// }
//
// export function convertSortedSetIncrementRequest(
//   request: cache.cache_client._SortedSetIncrementRequest
// ): SortedSetIncrementRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     value: convertBytesToString(request.value),
//     amount: request.amount,
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//   };
// }
//
// interface SortedSetGetRankRequestLoggingFormat {
//   set_name: string;
//   value: string;
//   order: 'ascending' | 'descending'; // enum with 0 = ascending, 1 = descending
// }
//
// export function convertSortedSetGetRankRequest(
//   request: cache.cache_client._SortedSetGetRankRequest
// ): SortedSetGetRankRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     value: convertBytesToString(request.value),
//     order: request.order ? 'descending' : 'ascending',
//   };
// }
//
// interface SortedSetLengthRequestLoggingFormat {
//   set_name: string;
// }
//
// export function convertSortedSetLengthRequest(
//   request: cache.cache_client._SortedSetLengthRequest
// ): SortedSetLengthRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//   };
// }
//
// interface SortedSetLengthByScoreRequestLoggingFormat {
//   set_name: string;
//   min_score: number | string;
//   min_score_exclusive?: boolean;
//   max_score: number | string;
//   max_score_exclusive?: boolean;
// }
//
// export function convertSortedSetLengthByScoreRequest(
//   request: cache.cache_client._SortedSetLengthByScoreRequest
// ): SortedSetLengthByScoreRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     min_score: request.unbounded_min
//       ? 'unbounded'
//       : request.inclusive_min ?? request.exclusive_min,
//     min_score_exclusive: request.unbounded_min
//       ? undefined
//       : request.inclusive_min
//       ? false
//       : true,
//     max_score: request.unbounded_max
//       ? 'unbounded'
//       : request.inclusive_max ?? request.exclusive_max,
//     max_score_exclusive: request.unbounded_max
//       ? undefined
//       : request.inclusive_max
//       ? false
//       : true,
//   };
// }
//
// interface LeaderboardDeleteRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
// }
//
// export function convertLeaderboardDeleteRequest(
//   request: leaderboard.leaderboard._DeleteLeaderboardRequest
// ): LeaderboardDeleteRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//   };
// }
//
// interface LeaderboardLengthRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
// }
//
// export function convertLeaderboardLengthRequest(
//   request: leaderboard.leaderboard._GetLeaderboardLengthRequest
// ): LeaderboardLengthRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//   };
// }
//
// interface LeaderboardUpsertRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
//   elements: {id: number; score: number}[];
// }
//
// export function convertLeaderboardUpsertRequest(
//   request: leaderboard.leaderboard._UpsertElementsRequest
// ): LeaderboardUpsertRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//     elements: request.elements.map(element => {
//       return {
//         id: element.id,
//         score: element.score,
//       };
//     }),
//   };
// }
//
// interface LeaderboardGetByRankRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
//   order: 'ascending' | 'descending'; // enum with 0 = ascending, 1 = descending
//   inclusive_start: number;
//   exclusive_end: number;
// }
//
// export function convertLeaderboardGetByRankRequest(
//   request: leaderboard.leaderboard._GetByRankRequest
// ): LeaderboardGetByRankRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//     order: request.order ? 'descending' : 'ascending',
//     inclusive_start: request.rank_range.start_inclusive,
//     exclusive_end: request.rank_range.end_exclusive,
//   };
// }
//
// interface LeaderboardGetRankRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
//   order: 'ascending' | 'descending'; // enum with 0 = ascending, 1 = descending
//   ids: number[];
// }
//
// export function convertLeaderboardGetRankRequest(
//   request: leaderboard.leaderboard._GetRankRequest
// ): LeaderboardGetRankRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//     order: request.order ? 'descending' : 'ascending',
//     ids: request.ids,
//   };
// }
//
// interface LeaderboardRemoveRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
//   ids: number[];
// }
//
// export function convertLeaderboardRemoveRequest(
//   request: leaderboard.leaderboard._RemoveElementsRequest
// ): LeaderboardRemoveRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//     ids: request.ids,
//   };
// }
//
// interface LeaderboardGetByScoreRequestLoggingFormat {
//   cache_name: string;
//   leaderboard_name: string;
//   order: 'ascending' | 'descending'; // enum with 0 = ascending, 1 = descending
//   offset: number;
//   limit: number;
//   inclusive_min: number | 'unbounded';
//   exclusive_max: number | 'unbounded';
// }
//
// export function convertLeaderboardGetByScoreRequest(
//   request: leaderboard.leaderboard._GetByScoreRequest
// ): LeaderboardGetByScoreRequestLoggingFormat {
//   return {
//     cache_name: request.cache_name,
//     leaderboard_name: request.leaderboard,
//     order: request.order ? 'descending' : 'ascending',
//     offset: request.offset,
//     limit: request.limit_elements,
//     inclusive_min: request.score_range.unbounded_min
//       ? 'unbounded'
//       : request.score_range.min_inclusive,
//     exclusive_max: request.score_range.unbounded_max
//       ? 'unbounded'
//       : request.score_range.max_exclusive,
//   };
// }
