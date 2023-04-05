// import {v4} from 'uuid';
// import {
//   ItBehavesLikeItValidatesCacheName,
//   testCacheName,
//   ValidateCacheProps,
//   WithCache,
// } from './common-int-test-utils';
import {ICacheClient} from '@gomomento/common/dist/src/internal/clients/cache/ICacheClient';
// import {
//   // CreateCache,
//   // DeleteCache,
//   // ListCaches,
//   // MomentoErrorCode,
//   // CacheFlush,
//   CacheGet,
// } from '@gomomento/common';
import {
  _GetRequest,
  _SetRequest,
} from '@gomomento/generated-types-webtext/dist/cacheclient_pb';
import {cache} from '@gomomento/generated-types-webtext';
import {CredentialProvider} from '@gomomento/common';
import {TextDecoder, TextEncoder} from 'util';

import * as jspb from 'google-protobuf';
// const jspb = require('google-protobuf');

export function runCreateDeleteListCacheTests(Momento: ICacheClient) {
  // describe('create/delete cache', () => {
  //   ItBehavesLikeItValidatesCacheName((props: ValidateCacheProps) => {
  //     return Momento.createCache(props.cacheName);
  //   });
  //
  //   ItBehavesLikeItValidatesCacheName((props: ValidateCacheProps) => {
  //     return Momento.deleteCache(props.cacheName);
  //   });
  //
  //   it('should return NotFoundError if deleting a non-existent cache', async () => {
  //     const cacheName = testCacheName();
  //     const deleteResponse = await Momento.deleteCache(cacheName);
  //     expect(deleteResponse).toBeInstanceOf(DeleteCache.Response);
  //     expect(deleteResponse).toBeInstanceOf(DeleteCache.Error);
  //     if (deleteResponse instanceof DeleteCache.Error) {
  //       expect(deleteResponse.errorCode()).toEqual(
  //         MomentoErrorCode.NOT_FOUND_ERROR
  //       );
  //     }
  //   });
  //
  //   it('should return AlreadyExists response if trying to create a cache that already exists', async () => {
  //     const cacheName = testCacheName();
  //     await WithCache(Momento, cacheName, async () => {
  //       const createResponse = await Momento.createCache(cacheName);
  //       expect(createResponse).toBeInstanceOf(CreateCache.AlreadyExists);
  //     });
  //   });
  //
  //   it('should create 1 cache and list the created cache', async () => {
  //     const cacheName = testCacheName();
  //     await WithCache(Momento, cacheName, async () => {
  //       const listResponse = await Momento.listCaches();
  //       expect(listResponse).toBeInstanceOf(ListCaches.Success);
  //       if (listResponse instanceof ListCaches.Success) {
  //         const caches = listResponse.getCaches();
  //         const names = caches.map(c => c.getName());
  //         expect(names.includes(cacheName)).toBeTruthy();
  //       }
  //     });
  //   });

  describe('flush cache', () => {
    // ItBehavesLikeItValidatesCacheName((props: ValidateCacheProps) => {
    //   return Momento.flushCache(props.cacheName);
    // });
    //
    // it('should return NotFoundError if flushing a non-existent cache', async () => {
    //   const cacheName = testCacheName();
    //   const flushResponse = await Momento.flushCache(cacheName);
    //   expect(flushResponse).toBeInstanceOf(CacheFlush.Response);
    //   expect(flushResponse).toBeInstanceOf(CacheFlush.Error);
    //   if (flushResponse instanceof CacheFlush.Error) {
    //     expect(flushResponse.errorCode()).toEqual(
    //       MomentoErrorCode.NOT_FOUND_ERROR
    //     );
    //   }
    // });

    // it('should return success while flushing empty cache', async () => {
    //   const cacheName = testCacheName();
    //   await WithCache(Momento, cacheName, async () => {
    //     const flushResponse = await Momento.flushCache(cacheName);
    //     expect(flushResponse).toBeInstanceOf(CacheFlush.Response);
    //     expect(flushResponse).toBeInstanceOf(CacheFlush.Success);
    //   });
    // });

    // it('should return success while flushing non-empty cache', async () => {
    //   const cacheName = testCacheName();
    //   const key1 = v4();
    //   const key2 = v4();
    //   const value1 = v4();
    //   const value2 = v4();
    //   await WithCache(Momento, cacheName, async () => {
    //     await Momento.set(cacheName, key1, value1);
    //     await Momento.set(cacheName, key2, value2);
    //     const flushResponse = await Momento.flushCache(cacheName);
    //     expect(flushResponse).toBeInstanceOf(CacheFlush.Response);
    //     expect(flushResponse).toBeInstanceOf(CacheFlush.Success);
    //     const getResponse1 = await Momento.get(cacheName, key1);
    //     const getResponse2 = await Momento.get(cacheName, key2);
    //     expect(getResponse1).toBeInstanceOf(CacheGet.Miss);
    //     expect(getResponse2).toBeInstanceOf(CacheGet.Miss);
    //   });
    // });

    it('should support scalar set and get with strings, but this test should be in a different file', async () => {
      const cacheName = 'butt';
      // const key1 = v4();
      // const value1 = v4();

      // const encoder = new TextEncoder();
      // const key1Bytes: Uint8Array = encoder.encode('key1');
      // const value1Bytes: Uint8Array = encoder.encode('test');

      const credentialProvider = CredentialProvider.fromEnvironmentVariable({
        environmentVariableName: 'TEST_AUTH_TOKEN',
      });

      const metadata = {
        cache: cacheName,
        authorization: credentialProvider.getAuthToken(),
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const textEncoder = new TextEncoder();
      // const key1Bytes = textEncoder.encode('key1');
      // const value1Bytes = textEncoder.encode('value1');
      const key1Bytes = btoa('key1');
      const value1Bytes = btoa('value1');

      await doSetAndGet(key1Bytes, value1Bytes, metadata);

      const textDecoder = new TextDecoder();

      const key2AsUint8Array = textEncoder.encode('key2');
      const key2AsBase64 = btoa(textDecoder.decode(key2AsUint8Array));
      await doSetAndGet(key2AsBase64, btoa('VALUE 2 YO'), metadata);

      const byteArrayKeyThatIsNotAString = new Uint8Array([
        0, 254, 102, 90, 15, 1,
      ]);
      const byteArrayKeyAsBase64 = btoa(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        String.fromCharCode.apply(null, byteArrayKeyThatIsNotAString)
      );
      await doSetAndGet(byteArrayKeyAsBase64, btoa('FOOOO'), metadata);

      // await Momento.set(cacheName, 'key1', 'test', {ttl: 300});
      //
      // const getResponse1 = await Momento.get(cacheName, 'key1');
      // console.log('resp', getResponse1);
      // expect(getResponse1).toBeInstanceOf(CacheGet.Hit);
      // const hit1 = getResponse1 as CacheGet.Hit;
      // expect(hit1.valueString()).toEqual('test');

      // await Momento.set(cacheName, 'key2', 'test');
      // const getResponse2 = await Momento.get(cacheName, 'key2');
      // console.log('resp', getResponse1);
      // expect(getResponse2).toBeInstanceOf(CacheGet.Hit);
      // const hit2 = getResponse2 as CacheGet.Hit;
      // expect(hit2.valueString()).toEqual('test');

      // await WithCache(Momento, cacheName, async () => {
      //   await Momento.set(cacheName, 'key1', 'test');
      //   const getResponse1 = await Momento.get(cacheName, 'key1');
      //   console.log('resp', getResponse1);
      //   expect(getResponse1).toBeInstanceOf(CacheGet.Hit);
      //   const hit = getResponse1 as CacheGet.Hit;
      //   expect(hit.valueString()).toEqual('test');
      // });
    });
  });
  // });

  async function doSetAndGet(
    keyb64: string,
    valb64: string,
    metadata: Record<string, string>
  ) {
    const setRequest = new _SetRequest();
    setRequest.setCacheKey(keyb64);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`SUPPORTS UINT8ARRAY: ${jspb.Message.SUPPORTS_UINT8ARRAY_}`);
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `SET REQUEST CACHE KEY AS B64: ${setRequest.getCacheKey_asB64()}`
    );
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `SET REQUEST CACHE KEY: ${setRequest.getCacheKey()}`
    );
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `SET REQUEST CACHE KEY AS U8: ${setRequest.getCacheKey_asU8()}`
    );
    setRequest.setCacheBody(valb64);
    setRequest.setTtlMilliseconds(300 * 1000);

    const generatedClient = new cache.ScsClient(
      'https://cache.cell-alpha-dev.preprod.a.momentohq.com',
      null,
      {
        unaryInterceptors: [],
      }
    );
    const setResponse = await generatedClient.set(setRequest, metadata);
    console.log(`GENERATED CLIENT RESULT: ${setResponse.getResult()}`);

    const getRequest = new _GetRequest();
    getRequest.setCacheKey(keyb64);
    const getResponse = await generatedClient.get(getRequest, metadata);
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `GENERATED CLIENT GET RESPONSE AS U8: ${getResponse.getCacheBody_asU8()}`
    );
    const textDecoder = new TextDecoder();
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `GENERATED CLIENT GET RESPONSE AS U8, DECODED: ${textDecoder.decode(
        getResponse.getCacheBody_asU8()
      )}`
    );
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `GENERATED CLIENT GET RESPONSE AS B64: ${getResponse.getCacheBody_asB64()}`
    );
    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `GENERATED CLIENT GET RESPONSE WITHOUT SPECIFYING TYPE: ${getResponse.getCacheBody()}`
    );
  }
}
