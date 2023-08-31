import {IVectorClient} from '@gomomento/sdk-core/dist/src/clients/IVectorClient';
import {ItBehavesLikeItValidatesIndexName, ValidateVectorProps} from "./common-int-test-utils";

export function runVectorIndexTest(vectorClient: IVectorClient) {
  describe('addItem validation', () => {
    ItBehavesLikeItValidatesIndexName((props: ValidateVectorProps) => {
      return vectorClient.addItemBatch(props.indexName, );
    });
    // ItBehavesLikeItValidatesIndexName((props: ValidateVectorProps) => {
    //   return vectorClient.deleteIndex(props.indexName);
    // });

    // TODO: validate index name
    expect(true).toEqual(false);
  });

  describe('search validation', () => {
    // ItBeha/*vesLikeItValidatesIndexName((props: ValidateVectorProps) => {
    //   return vectorClient.createIndex(props.indexName, props.numDimensions);
    // });
    // ItBehavesLikeItValidatesIndexName((props: ValidateVectorProps) => {
    //   return vectorClient.deleteIndex(props.indexName);
    // });*/

    // TODO: validate index name
    expect(true).toEqual(false);

    // TODO: validate top_k
    expect(true).toEqual(false);
  });

  describe('delete validation', () => {
    // ItBehavesLikeItValidatesIndexName((props: ValidateVectorProps) => {
    //   return vectorClient.createIndex(props.indexName, props.numDimensions);
    // });
    // ItBehavesLikeItValidatesIndexName((props: ValidateVectorProps) => {
    //   return vectorClient.deleteIndex(props.indexName);
    // });

    // TODO: validate index name
    expect(true).toEqual(false);
  });

  describe('addItem and search', () => {
    //   async def test_create_index_add_item_search_happy_path(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name, items=[Item(id="test_item", vector=[1.0, 2.0])]
    //   )
    //   assert isinstance(add_response, AddItemBatch.Success)
    //
    //   await sleep_async(2)
    //
    //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=1)
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 1
    //   assert search_response.hits[0].id == "test_item"
    //   assert search_response.hits[0].distance == 5.0
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //

    it('should support addItem and search', () => {
      // const indexName = testIndexName();
      // const createResponse = await vectorClient.createIndex(indexName, 1);
      // expect(createResponse).toBeInstanceOf(CreateVectorIndex.Success);
      // const deleteResponse = await vectorClient.deleteIndex(indexName);
      // expectWithMessage(() => {
      //   expect(deleteResponse).toBeInstanceOf(DeleteVectorIndex.Success);
      // }, `expected SUCCESS but got ${deleteResponse.toString()}`);
      expect(true).toEqual(false);
    });

    //   async def test_create_index_add_multiple_items_search_happy_path(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name,
    //     items=[
    //       Item(id="test_item_1", vector=[1.0, 2.0]),
    //       Item(id="test_item_2", vector=[3.0, 4.0]),
    //       Item(id="test_item_3", vector=[5.0, 6.0]),
    //     ],
    //   )
    //   assert isinstance(add_response, AddItemBatch.Success)
    //
    //   await sleep_async(2)
    //
    //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=3)
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 3
    //
    //   assert search_response.hits == [
    //     SearchHit(id="test_item_3", distance=17.0),
    //     SearchHit(id="test_item_2", distance=11.0),
    //     SearchHit(id="test_item_1", distance=5.0),
    //   ]
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //

    it('should support adding multiple items and searching', () => {
      expect(true).toEqual(false);
    });

    //   async def test_create_index_add_multiple_items_search_with_top_k_happy_path(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name,
    //     items=[
    //       Item(id="test_item_1", vector=[1.0, 2.0]),
    //       Item(id="test_item_2", vector=[3.0, 4.0]),
    //       Item(id="test_item_3", vector=[5.0, 6.0]),
    //     ],
    //   )
    //   assert isinstance(add_response, AddItemBatch.Success)
    //
    //   await sleep_async(2)
    //
    //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=2)
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 2
    //
    //   assert search_response.hits == [
    //     SearchHit(id="test_item_3", distance=17.0),
    //     SearchHit(id="test_item_2", distance=11.0),
    //   ]
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //
    it('should support adding multiple items and searching with top k', () => {
      expect(true).toEqual(false);
    });

    //
    //   async def test_add_and_search_with_metadata_happy_path(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name,
    //     items=[
    //       Item(id="test_item_1", vector=[1.0, 2.0], metadata={"key1": "value1"}),
    //       Item(id="test_item_2", vector=[3.0, 4.0], metadata={"key2": "value2"}),
    //       Item(id="test_item_3", vector=[5.0, 6.0], metadata={"key1": "value3", "key3": "value3"}),
    //     ],
    //   )
    //   assert isinstance(add_response, AddItemBatch.Success)
    //
    //   await sleep_async(2)
    //
    //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=3)
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 3
    //
    //   assert search_response.hits == [
    //     SearchHit(id="test_item_3", distance=17.0),
    //     SearchHit(id="test_item_2", distance=11.0),
    //     SearchHit(id="test_item_1", distance=5.0),
    //   ]
    //
    //   search_response = await vector_index_client_async.search(
    //     index_name, query_vector=[1.0, 2.0], top_k=3, metadata_fields=["key1"]
    //   )
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 3
    //
    //   assert search_response.hits == [
    //     SearchHit(id="test_item_3", distance=17.0, metadata={"key1": "value3"}),
    //     SearchHit(id="test_item_2", distance=11.0, metadata={}),
    //     SearchHit(id="test_item_1", distance=5.0, metadata={"key1": "value1"}),
    //   ]
    //
    //   search_response = await vector_index_client_async.search(
    //     index_name, query_vector=[1.0, 2.0], top_k=3, metadata_fields=["key1", "key2", "key3", "key4"]
    //   )
    //   assert isinstance(search_response, Search.Success)
    //   assert len(search_response.hits) == 3
    //
    //   assert search_response.hits == [
    //     SearchHit(id="test_item_3", distance=17.0, metadata={"key1": "value3", "key3": "value3"}),
    //     SearchHit(id="test_item_2", distance=11.0, metadata={"key2": "value2"}),
    //     SearchHit(id="test_item_1", distance=5.0, metadata={"key1": "value1"}),
    //   ]
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //
    //
    it('should support add and search with metadata', () => {
      expect(true).toEqual(false);
    });

    //   async def test_create_index_add_item_dimensions_different_than_num_dimensions_error(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    // # adding 3 dimensions
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name, items=[Item(id="test_item", vector=[1.0, 2.0, 3.0])]
    //   )
    //   assert isinstance(add_response, AddItemBatch.Error)
    //
    //   expected_inner_ex_message = "invalid parameter: vector, vector dimension has to match the index's dimension"
    //   expected_message = f"Invalid argument passed to Momento client: {expected_inner_ex_message}"
    //   assert add_response.message == expected_message
    //   assert add_response.inner_exception.message == expected_inner_ex_message
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //
    it('should fail when adding item with wrong number of dimensions', () => {
      expect(true).toEqual(false);
    });

    //
    //   async def test_create_index_add_multiple_items_search_with_top_k_query_vector_dimensions_incorrect(
    //     vector_index_client_async: PreviewVectorIndexClientAsync,
    //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
    // ) -> None:
    //     index_name = unique_vector_index_name_async(vector_index_client_async)
    //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
    //   assert isinstance(create_response, CreateIndex.Success)
    //
    //   add_response = await vector_index_client_async.add_item_batch(
    //     index_name,
    //     items=[
    //       Item(id="test_item_1", vector=[1.0, 2.0]),
    //       Item(id="test_item_2", vector=[3.0, 4.0]),
    //       Item(id="test_item_3", vector=[5.0, 6.0]),
    //     ],
    //   )
    //   assert isinstance(add_response, AddItemBatch.Success)
    //
    //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0, 3.0], top_k=2)
    //   assert isinstance(search_response, Search.Error)
    //
    //   expected_inner_ex_message = "invalid parameter: query_vector, query vector dimension must match the index dimension"
    //   expected_resp_message = f"Invalid argument passed to Momento client: {expected_inner_ex_message}"
    //
    //   assert search_response.inner_exception.message == expected_inner_ex_message
    //   assert search_response.message == expected_resp_message
    //
    //   del_response = await vector_index_client_async.delete_index(index_name)
    //   assert isinstance(del_response, DeleteIndex.Success)
    //
    //

    it('should fail when searching with wrong number of dimensions', () => {
      expect(true).toEqual(false);
    });
  });

  //   async def test_delete_deletes_ids(
  //     vector_index_client_async: PreviewVectorIndexClientAsync,
  //     unique_vector_index_name_async: TUniqueVectorIndexNameAsync,
  // ) -> None:
  //     index_name = unique_vector_index_name_async(vector_index_client_async)
  //   create_response = await vector_index_client_async.create_index(index_name, num_dimensions=2)
  //   assert isinstance(create_response, CreateIndex.Success)
  //
  //   add_response = await vector_index_client_async.add_item_batch(
  //     index_name,
  //     items=[
  //       Item(id="test_item_1", vector=[1.0, 2.0]),
  //       Item(id="test_item_2", vector=[3.0, 4.0]),
  //       Item(id="test_item_3", vector=[5.0, 6.0]),
  //       Item(id="test_item_3", vector=[7.0, 8.0]),
  //     ],
  //   )
  //   assert isinstance(add_response, AddItemBatch.Success)
  //
  //   await sleep_async(2)
  //
  //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=10)
  //   assert isinstance(search_response, Search.Success)
  //   assert len(search_response.hits) == 3
  //
  //   assert search_response.hits == [
  //     SearchHit(id="test_item_3", distance=23.0),
  //     SearchHit(id="test_item_2", distance=11.0),
  //     SearchHit(id="test_item_1", distance=5.0),
  //   ]
  //
  //   delete_response = await vector_index_client_async.delete_item_batch(index_name, ids=["test_item_1", "test_item_3"])
  //   assert isinstance(delete_response, DeleteItemBatch.Success)
  //
  //   await sleep_async(2)
  //
  //   search_response = await vector_index_client_async.search(index_name, query_vector=[1.0, 2.0], top_k=10)
  //   assert isinstance(search_response, Search.Success)
  //   assert len(search_response.hits) == 1
  //
  //   assert search_response.hits == [
  //     SearchHit(id="test_item_2", distance=11.0),
  //   ]
  //
  //   del_response = await vector_index_client_async.delete_index(index_name)
  //   assert isinstance(del_response, DeleteIndex.Success)

  describe('deleteItem', () => {
    it('should delete ids', () => {
      expect(true).toEqual(false);
    });
  });
}
