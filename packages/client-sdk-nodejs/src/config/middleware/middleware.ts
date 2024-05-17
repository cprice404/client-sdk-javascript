import {Metadata, StatusObject} from '@grpc/grpc-js';
import {Message} from 'google-protobuf';
import {RequestToLogInterfaceConverter} from './request-logging-formats';

export class MiddlewareMetadata {
  readonly _grpcMetadata: Metadata;
  constructor(metadata: Metadata) {
    this._grpcMetadata = metadata;
  }

  toJsonString(): string {
    return JSON.stringify(this._grpcMetadata.toJSON());
  }
}
export class MiddlewareStatus {
  readonly _grpcStatus: StatusObject;
  constructor(status: StatusObject) {
    this._grpcStatus = status;
  }

  code() {
    return this._grpcStatus.code;
  }
}

export class MiddlewareMessage {
  readonly _grpcMessage: Message;
  constructor(message: Message) {
    this._grpcMessage = message;
  }

  messageLength(): number {
    if (this._grpcMessage !== null && this._grpcMessage !== undefined) {
      return this._grpcMessage.serializeBinary().length;
    }
    return 0;
  }

  constructorName(): string {
    return this._grpcMessage.constructor.name;
  }

  // Note: APIs that use streaming interceptors (e.g. GetBatch and SetBatch)
  // will not see these debug messages
  toString(): string {
    const requestToLogConverter = RequestToLogInterfaceConverter.get(
      this.constructorName()
    );
    if (requestToLogConverter === undefined) {
      console.warn(
        'Unable to find requestToLogConverter for',
        this.constructorName()
      );
      return `UNKNOWN TYPE: ${this.constructorName()}`;
    }
    return JSON.stringify(requestToLogConverter(this._grpcMessage));

    // switch (this._grpcMessage.constructor) {
    //   case cache.cache_client._GetRequest: {
    //     return JSON.stringify(
    //       convertSingleKeyRequest(
    //         (this._grpcMessage as cache.cache_client._GetRequest).cache_key
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetRequest: {
    //     return JSON.stringify(
    //       convertSetRequest(this._grpcMessage as cache.cache_client._SetRequest)
    //     );
    //   }
    //   case cache.cache_client._GetBatchRequest: {
    //     return JSON.stringify(
    //       convertGetBatchRequest(
    //         this._grpcMessage as cache.cache_client._GetBatchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DeleteRequest: {
    //     return JSON.stringify(
    //       convertSingleKeyRequest(
    //         (this._grpcMessage as cache.cache_client._DeleteRequest).cache_key
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetBatchRequest: {
    //     return JSON.stringify(
    //       convertSetBatchRequest(
    //         this._grpcMessage as cache.cache_client._SetBatchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetIfRequest: {
    //     return JSON.stringify(
    //       convertSetIfRequest(
    //         this._grpcMessage as cache.cache_client._SetIfRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._KeysExistRequest: {
    //     return JSON.stringify(
    //       convertKeysExistRequest(
    //         this._grpcMessage as cache.cache_client._KeysExistRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._IncrementRequest: {
    //     return JSON.stringify(
    //       convertIncrementRequest(
    //         this._grpcMessage as cache.cache_client._IncrementRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._UpdateTtlRequest: {
    //     return JSON.stringify(
    //       convertUpdateTtlRequest(
    //         this._grpcMessage as cache.cache_client._UpdateTtlRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ItemGetTtlRequest: {
    //     return JSON.stringify(
    //       convertSingleKeyRequest(
    //         (this._grpcMessage as cache.cache_client._ItemGetTtlRequest)
    //           .cache_key
    //       )
    //     );
    //   }
    //   case cache.cache_client._ItemGetTypeRequest: {
    //     return JSON.stringify(
    //       convertSingleKeyRequest(
    //         (this._grpcMessage as cache.cache_client._ItemGetTypeRequest)
    //           .cache_key
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionaryGetRequest: {
    //     return JSON.stringify(
    //       convertDictionaryGetRequest(
    //         this._grpcMessage as cache.cache_client._DictionaryGetRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionaryFetchRequest: {
    //     return JSON.stringify(
    //       convertDictionaryFetchRequest(
    //         this._grpcMessage as cache.cache_client._DictionaryFetchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionarySetRequest: {
    //     return JSON.stringify(
    //       convertDictionarySetRequest(
    //         this._grpcMessage as cache.cache_client._DictionarySetRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionaryIncrementRequest: {
    //     return JSON.stringify(
    //       convertDictionaryIncrementRequest(
    //         this._grpcMessage as cache.cache_client._DictionaryIncrementRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionaryDeleteRequest: {
    //     return JSON.stringify(
    //       convertDictionaryDeleteRequest(
    //         this._grpcMessage as cache.cache_client._DictionaryDeleteRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._DictionaryLengthRequest: {
    //     return JSON.stringify(
    //       convertDictionaryLengthRequest(
    //         this._grpcMessage as cache.cache_client._DictionaryLengthRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetFetchRequest: {
    //     return JSON.stringify(
    //       convertSetFetchRequest(
    //         this._grpcMessage as cache.cache_client._SetFetchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetSampleRequest: {
    //     return JSON.stringify(
    //       convertSetSampleRequest(
    //         this._grpcMessage as cache.cache_client._SetSampleRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetUnionRequest: {
    //     return JSON.stringify(
    //       convertSetUnionRequest(
    //         this._grpcMessage as cache.cache_client._SetUnionRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetDifferenceRequest: {
    //     return JSON.stringify(
    //       convertSetDifferenceRequest(
    //         this._grpcMessage as cache.cache_client._SetDifferenceRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetContainsRequest: {
    //     return JSON.stringify(
    //       convertSetContainsRequest(
    //         this._grpcMessage as cache.cache_client._SetContainsRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetLengthRequest: {
    //     return JSON.stringify(
    //       convertSetLengthRequest(
    //         this._grpcMessage as cache.cache_client._SetLengthRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SetPopRequest: {
    //     return JSON.stringify(
    //       convertSetPopRequest(
    //         this._grpcMessage as cache.cache_client._SetPopRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListConcatenateFrontRequest: {
    //     return JSON.stringify(
    //       convertListConcatenateFrontRequest(
    //         this._grpcMessage as cache.cache_client._ListConcatenateFrontRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListConcatenateBackRequest: {
    //     return JSON.stringify(
    //       convertListConcatenateBackRequest(
    //         this._grpcMessage as cache.cache_client._ListConcatenateBackRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListPushFrontRequest: {
    //     return JSON.stringify(
    //       convertListPushFrontRequest(
    //         this._grpcMessage as cache.cache_client._ListPushFrontRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListPushBackRequest: {
    //     return JSON.stringify(
    //       convertListPushBackRequest(
    //         this._grpcMessage as cache.cache_client._ListPushBackRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListPopFrontRequest: {
    //     return JSON.stringify(
    //       convertListPopFrontRequest(
    //         this._grpcMessage as cache.cache_client._ListPopFrontRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListPopBackRequest: {
    //     return JSON.stringify(
    //       convertListPopBackRequest(
    //         this._grpcMessage as cache.cache_client._ListPopBackRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListRemoveRequest: {
    //     return JSON.stringify(
    //       convertListRemoveValueRequest(
    //         this._grpcMessage as cache.cache_client._ListRemoveRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListFetchRequest: {
    //     return JSON.stringify(
    //       convertListFetchRequest(
    //         this._grpcMessage as cache.cache_client._ListFetchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListRetainRequest: {
    //     return JSON.stringify(
    //       convertListRetainRequest(
    //         this._grpcMessage as cache.cache_client._ListRetainRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._ListLengthRequest: {
    //     return JSON.stringify(
    //       convertListLengthRequest(
    //         this._grpcMessage as cache.cache_client._ListLengthRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetPutRequest: {
    //     return JSON.stringify(
    //       convertSortedSetPutRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetPutRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetFetchRequest: {
    //     return JSON.stringify(
    //       convertSortedSetFetchRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetFetchRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetGetScoreRequest: {
    //     return JSON.stringify(
    //       convertSortedSetGetScoreRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetGetScoreRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetRemoveRequest: {
    //     return JSON.stringify(
    //       convertSortedSetRemoveRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetRemoveRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetIncrementRequest: {
    //     return JSON.stringify(
    //       convertSortedSetIncrementRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetIncrementRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetGetRankRequest: {
    //     return JSON.stringify(
    //       convertSortedSetGetRankRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetGetRankRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetLengthRequest: {
    //     return JSON.stringify(
    //       convertSortedSetLengthRequest(
    //         this._grpcMessage as cache.cache_client._SortedSetLengthRequest
    //       )
    //     );
    //   }
    //   case cache.cache_client._SortedSetLengthByScoreRequest: {
    //     return JSON.stringify(
    //       convertSortedSetLengthByScoreRequest(
    //         this
    //           ._grpcMessage as cache.cache_client._SortedSetLengthByScoreRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._DeleteLeaderboardRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardDeleteRequest(
    //         this
    //           ._grpcMessage as leaderboard.leaderboard._DeleteLeaderboardRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._GetLeaderboardLengthRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardLengthRequest(
    //         this
    //           ._grpcMessage as leaderboard.leaderboard._GetLeaderboardLengthRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._UpsertElementsRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardUpsertRequest(
    //         this._grpcMessage as leaderboard.leaderboard._UpsertElementsRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._GetByRankRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardGetByRankRequest(
    //         this._grpcMessage as leaderboard.leaderboard._GetByRankRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._GetRankRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardGetRankRequest(
    //         this._grpcMessage as leaderboard.leaderboard._GetRankRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._RemoveElementsRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardRemoveRequest(
    //         this._grpcMessage as leaderboard.leaderboard._RemoveElementsRequest
    //       )
    //     );
    //   }
    //   case leaderboard.leaderboard._GetByScoreRequest: {
    //     return JSON.stringify(
    //       convertLeaderboardGetByScoreRequest(
    //         this._grpcMessage as leaderboard.leaderboard._GetByScoreRequest
    //       )
    //     );
    //   }
    //   default: {
    //     return this.constructorName();
    //   }
    // }
  }
}

export interface MiddlewareRequestHandler {
  onRequestMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata>;
  onRequestBody(request: MiddlewareMessage): Promise<MiddlewareMessage>;

  onResponseMetadata(metadata: MiddlewareMetadata): Promise<MiddlewareMetadata>;
  onResponseBody(
    response: MiddlewareMessage | null
  ): Promise<MiddlewareMessage | null>;
  onResponseStatus(status: MiddlewareStatus): Promise<MiddlewareStatus>;
}

export interface MiddlewareRequestHandlerContext {
  [key: symbol]: string;
}

/**
 * The Middleware interface allows the Configuration to provide a higher-order function that wraps all requests.
 * This allows future support for things like client-side metrics or other diagnostics helpers.
 *
 * An optional context can be provided that is essentially a <key, value> map {@link MiddlewareRequestHandlerContext}.
 * The context object is available to each individual invocation of the request handler for the middleware.
 */
export interface Middleware {
  onNewRequest(
    context?: MiddlewareRequestHandlerContext
  ): MiddlewareRequestHandler;
  init?(): void;
  close?(): void;
}
