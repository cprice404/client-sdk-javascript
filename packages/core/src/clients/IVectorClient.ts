import {IVectorControlClient} from '../internal/clients';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVectorClient extends IVectorControlClient {
  addItemBatch(indexName: string, items: Array<Item>): VectorAddItemBatch.Response
}
