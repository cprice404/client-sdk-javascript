import {IVectorIndexDataClient} from '@gomomento/sdk-core/dist/src/internal/clients/vector/IVectorIndexDataClient';
import {VectorIndexItem} from '@gomomento/sdk-core/dist/src/messages/vector-index';
import {
  SearchOptions,
  VectorAddItemBatch,
  VectorDeleteItemBatch,
  VectorSearch,
} from '@gomomento/sdk-core';
import {VectorIndexClientProps} from '../vector-index-client-props';

export class VectorDataClient implements IVectorIndexDataClient {
  constructor(props: VectorIndexClientProps) {
    throw new Error('Method not implemented.');
  }

  addItemBatch(
    indexName: string,
    items: Array<VectorIndexItem>
  ): Promise<VectorAddItemBatch.Response> {
    throw new Error('Method not implemented.');
  }

  deleteItemBatch(
    indexName: string,
    ids: Array<string>
  ): Promise<VectorDeleteItemBatch.Response> {
    throw new Error('Method not implemented.');
  }

  search(
    indexName: string,
    queryVector: Array<number>,
    options?: SearchOptions
  ): Promise<VectorSearch.Response> {
    throw new Error('Method not implemented.');
  }
}
