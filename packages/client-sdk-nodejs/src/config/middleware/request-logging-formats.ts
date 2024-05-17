import {cache} from '@gomomento/generated-types';
import {SetBatchItem} from "@gomomento/sdk-core";

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
        ttl: item.ttl_milliseconds,
      };
    }),
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
]);

//
// interface SetIfRequestLoggingFormat {
//   key: string;
//   value: string;
//   condition: string;
//   ttl_milliseconds: number;
// }
//
// export function convertSetIfRequest(
//   request: cache.cache_client._SetIfRequest
// ): SetIfRequestLoggingFormat {
//   return {
//     key: convertBytesToString(request.cache_key),
//     value: convertBytesToString(request.cache_body),
//     condition: request.condition,
//     ttl_milliseconds: request.ttl_milliseconds,
//   };
// }
//
// type KeysExistRequestLoggingFormat = RequestMultipleKeysLoggingFormat;
//
// export function convertKeysExistRequest(
//   request: cache.cache_client._KeysExistRequest
// ): KeysExistRequestLoggingFormat {
//   return {
//     keys: request.cache_keys.map(key => convertBytesToString(key)),
//   };
// }
//
// interface IncrementRequestLoggingFormat {
//   key: string;
//   amount: number;
//   ttl_milliseconds: number;
// }
//
// export function convertIncrementRequest(
//   request: cache.cache_client._IncrementRequest
// ): IncrementRequestLoggingFormat {
//   return {
//     key: convertBytesToString(request.cache_key),
//     amount: request.amount,
//     ttl_milliseconds: request.ttl_milliseconds,
//   };
// }
//
// interface UpdateTtlRequestLoggingFormat {
//   key: string;
//   amount: number;
//   action: 'increase' | 'decrease' | 'overwrite';
// }
//
// export function convertUpdateTtlRequest(
//   request: cache.cache_client._UpdateTtlRequest
// ): UpdateTtlRequestLoggingFormat {
//   return {
//     key: convertBytesToString(request.cache_key),
//     amount:
//       request.increase_to_milliseconds ||
//       request.decrease_to_milliseconds ||
//       request.overwrite_to_milliseconds,
//     action: request.increase_to_milliseconds
//       ? 'increase'
//       : request.decrease_to_milliseconds
//       ? 'decrease'
//       : 'overwrite',
//   };
// }
//
// interface DictionaryGetRequestLoggingFormat {
//   dictionary_name: string;
//   fields: string[];
// }
//
// export function convertDictionaryGetRequest(
//   request: cache.cache_client._DictionaryGetRequest
// ): DictionaryGetRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//     fields: request.fields.map(field => convertBytesToString(field)),
//   };
// }
//
// interface DictionaryFetchRequestLoggingFormat {
//   dictionary_name: string;
// }
//
// export function convertDictionaryFetchRequest(
//   request: cache.cache_client._DictionaryFetchRequest
// ): DictionaryFetchRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//   };
// }
//
// interface DictionarySetRequestLoggingFormat {
//   dictionary_name: string;
//   items: {field: string; value: string}[];
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
// }
//
// export function convertDictionarySetRequest(
//   request: cache.cache_client._DictionarySetRequest
// ): DictionarySetRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     items: request.items.map(item => {
//       return {
//         field: convertBytesToString(item.field),
//         value: convertBytesToString(item.value),
//       };
//     }),
//   };
// }
//
// interface DictionaryIncrementRequestLoggingFormat {
//   dictionary_name: string;
//   field: string;
//   amount: number;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
// }
//
// export function convertDictionaryIncrementRequest(
//   request: cache.cache_client._DictionaryIncrementRequest
// ): DictionaryIncrementRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//     field: convertBytesToString(request.field),
//     amount: request.amount,
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//   };
// }
//
// interface DictionaryDeleteRequestLoggingFormat {
//   dictionary_name: string;
//   fields: string[];
// }
//
// export function convertDictionaryDeleteRequest(
//   request: cache.cache_client._DictionaryDeleteRequest
// ): DictionaryDeleteRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//     fields: request.some.fields.map(field => convertBytesToString(field)),
//   };
// }
//
// interface DictionaryLengthRequestLoggingFormat {
//   dictionary_name: string;
// }
//
// export function convertDictionaryLengthRequest(
//   request: cache.cache_client._DictionaryLengthRequest
// ): DictionaryLengthRequestLoggingFormat {
//   return {
//     dictionary_name: convertBytesToString(request.dictionary_name),
//   };
// }
//
// interface SetFetchRequestLoggingFormat {
//   set_name: string;
// }
//
// export function convertSetFetchRequest(
//   request: cache.cache_client._SetFetchRequest
// ): SetFetchRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//   };
// }
//
// interface SetSampleRequestLoggingFormat {
//   set_name: string;
//   limit: number;
// }
//
// export function convertSetSampleRequest(
//   request: cache.cache_client._SetSampleRequest
// ): SetSampleRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     limit: request.limit,
//   };
// }
//
// interface SetUnionRequestLoggingFormat {
//   set_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   elements: string[];
// }
//
// export function convertSetUnionRequest(
//   request: cache.cache_client._SetUnionRequest
// ): SetUnionRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     elements: request.elements.map(element => convertBytesToString(element)),
//   };
// }
//
// interface SetDifferenceRequestLoggingFormat {
//   set_name: string;
//   action: 'minuend' | 'subtrahend_set' | 'subtrahend_identity';
//   elements?: string[];
// }
//
// export function convertSetDifferenceRequest(
//   request: cache.cache_client._SetDifferenceRequest
// ): SetDifferenceRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     action: request.minuend
//       ? 'minuend'
//       : request.subtrahend.set
//       ? 'subtrahend_set'
//       : 'subtrahend_identity',
//     elements: request.minuend
//       ? request.minuend.elements.map(element => convertBytesToString(element))
//       : request.subtrahend.set
//       ? request.subtrahend.set.elements.map(element =>
//           convertBytesToString(element)
//         )
//       : undefined,
//   };
// }
//
// interface SetContainsRequestLoggingFormat {
//   set_name: string;
//   elements: string[];
// }
//
// export function convertSetContainsRequest(
//   request: cache.cache_client._SetContainsRequest
// ): SetContainsRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     elements: request.elements.map(element => convertBytesToString(element)),
//   };
// }
//
// interface SetLengthRequestLoggingFormat {
//   set_name: string;
// }
//
// export function convertSetLengthRequest(
//   request: cache.cache_client._SetLengthRequest
// ): SetLengthRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//   };
// }
//
// interface SetPopRequestLoggingFormat {
//   set_name: string;
//   count: number;
// }
//
// export function convertSetPopRequest(
//   request: cache.cache_client._SetPopRequest
// ): SetPopRequestLoggingFormat {
//   return {
//     set_name: convertBytesToString(request.set_name),
//     count: request.count,
//   };
// }
//
// interface ListConcatenateFrontRequestLoggingFormat {
//   list_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   truncate_back_to_size: number;
//   values: string[];
// }
//
// export function convertListConcatenateFrontRequest(
//   request: cache.cache_client._ListConcatenateFrontRequest
// ): ListConcatenateFrontRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     truncate_back_to_size: request.truncate_back_to_size,
//     values: request.values.map(value => convertBytesToString(value)),
//   };
// }
//
// interface ListConcatenateBackRequestLoggingFormat {
//   list_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   truncate_front_to_size: number;
//   values: string[];
// }
//
// export function convertListConcatenateBackRequest(
//   request: cache.cache_client._ListConcatenateBackRequest
// ): ListConcatenateBackRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     truncate_front_to_size: request.truncate_front_to_size,
//     values: request.values.map(value => convertBytesToString(value)),
//   };
// }
//
// interface ListPushFrontRequestLoggingFormat {
//   list_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   truncate_back_to_size: number;
//   value: string;
// }
//
// export function convertListPushFrontRequest(
//   request: cache.cache_client._ListPushFrontRequest
// ): ListPushFrontRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     truncate_back_to_size: request.truncate_back_to_size,
//     value: convertBytesToString(request.value),
//   };
// }
//
// interface ListPushBackRequestLoggingFormat {
//   list_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   truncate_front_to_size: number;
//   value: string;
// }
//
// export function convertListPushBackRequest(
//   request: cache.cache_client._ListPushBackRequest
// ): ListPushBackRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     truncate_front_to_size: request.truncate_front_to_size,
//     value: convertBytesToString(request.value),
//   };
// }
//
// interface ListPopFrontRequestLoggingFormat {
//   list_name: string;
// }
//
// export function convertListPopFrontRequest(
//   request: cache.cache_client._ListPopFrontRequest
// ): ListPopFrontRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//   };
// }
//
// interface ListPopBackRequestLoggingFormat {
//   list_name: string;
// }
//
// export function convertListPopBackRequest(
//   request: cache.cache_client._ListPopBackRequest
// ): ListPopBackRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//   };
// }
//
// interface ListRemoveValueRequestLoggingFormat {
//   list_name: string;
//   value: string;
// }
//
// export function convertListRemoveValueRequest(
//   request: cache.cache_client._ListRemoveRequest
// ): ListRemoveValueRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     value: convertBytesToString(request.all_elements_with_value),
//   };
// }
//
// interface ListFetchRequestLoggingFormat {
//   list_name: string;
//   inclusive_start: number | 'unbounded';
//   exclusive_end: number | 'unbounded';
// }
//
// export function convertListFetchRequest(
//   request: cache.cache_client._ListFetchRequest
// ): ListFetchRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     inclusive_start: request.inclusive_start ?? 'unbounded',
//     exclusive_end: request.exclusive_end ?? 'unbounded',
//   };
// }
//
// interface ListRetainRequestLoggingFormat {
//   list_name: string;
//   ttl_milliseconds: number;
//   refresh_ttl: boolean;
//   inclusive_start: number | 'unbounded';
//   exclusive_end: number | 'unbounded';
// }
//
// export function convertListRetainRequest(
//   request: cache.cache_client._ListRetainRequest
// ): ListRetainRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//     ttl_milliseconds: request.ttl_milliseconds,
//     refresh_ttl: request.refresh_ttl,
//     inclusive_start: request.inclusive_start ?? 'unbounded',
//     exclusive_end: request.exclusive_end ?? 'unbounded',
//   };
// }
//
// interface ListLengthRequestLoggingFormat {
//   list_name: string;
// }
//
// export function convertListLengthRequest(
//   request: cache.cache_client._ListLengthRequest
// ): ListLengthRequestLoggingFormat {
//   return {
//     list_name: convertBytesToString(request.list_name),
//   };
// }
//
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
