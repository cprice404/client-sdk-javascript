import {control} from '@gomomento/generated-types-webtext';
import {
  CredentialProvider,
  MomentoLogger,
  CreateStore,
  DeleteStore,
  ListStores,
  StoreInfo,
  SdkError,
} from '..';
import {Request, StatusCode, UnaryResponse} from 'grpc-web';
import {
  _CreateStoreRequest,
  _DeleteStoreRequest,
  _ListStoresRequest,
} from '@gomomento/generated-types-webtext/dist/controlclient_pb';
import {IStorageControlClient} from '@gomomento/sdk-core/dist/src/internal/clients';
import {validateStoreName} from '@gomomento/sdk-core/dist/src/internal/utils';
import {getWebControlEndpoint} from '../utils/web-client-utils';
import {ClientMetadataProvider} from './client-metadata-provider';
import {StorageConfiguration} from '../config/storage-configuration';

export interface StorageClientClientProps {
  configuration: StorageConfiguration;
  credentialProvider: CredentialProvider;
}

export class StorageControlClient<
  REQ extends Request<REQ, RESP>,
  RESP extends UnaryResponse<REQ, RESP>
> implements IStorageControlClient
{
  private readonly clientWrapper: control.ScsControlClient;
  private readonly logger: MomentoLogger;

  private readonly clientMetadataProvider: ClientMetadataProvider;

  /**
   * @param {ControlClientProps} props
   */
  constructor(props: StorageClientClientProps) {
    this.logger = props.configuration.getLoggerFactory().getLogger(this);
    this.logger.debug(
      `Creating storage control client using endpoint: '${getWebControlEndpoint(
        props.credentialProvider
      )}`
    );

    this.clientMetadataProvider = new ClientMetadataProvider({
      authToken: props.credentialProvider.getAuthToken(),
      clientType: 'store',
    });
    this.clientWrapper = new control.ScsControlClient(
      // Note: all web SDK requests are routed to a `web.` subdomain to allow us flexibility on the server
      getWebControlEndpoint(props.credentialProvider),
      null,
      {}
    );
  }

  close() {
    this.logger.debug('Closing cache control client');
    // do nothing as gRPC web version doesn't expose a close() yet.
    // this is needed as we have added close to `IControlClient` extended
    // by both nodejs and web SDKs
  }

  public async createStore(name: string): Promise<CreateStore.Response> {
    try {
      validateStoreName(name);
    } catch (err) {
      return new CreateStore.Error(err as SdkError);
    }
    this.logger.debug(`Creating store: ${name}`);
    const request = new _CreateStoreRequest();
    request.setStoreName(name);

    return await new Promise<CreateStore.Response>((resolve, reject) => {
      this.clientWrapper.createStore(
        request,
        this.clientMetadataProvider.createClientMetadata(),
        (err, _resp) => {
          if (err) {
            if (err.code === StatusCode.ALREADY_EXISTS) {
              resolve(new CreateStore.AlreadyExists());
            } else {
              return resolve(new CreateStore.Error(err as unknown as SdkError));
            }
          } else {
            resolve(new CreateStore.Success());
          }
        }
      );
    });
  }

  public async deleteStore(name: string): Promise<DeleteStore.Response> {
    try {
      validateStoreName(name);
    } catch (err) {
      return new DeleteStore.Error(err as SdkError);
      // return this.cacheServiceErrorMapper.returnOrThrowError(
      //   err as Error,
      //   err => new DeleteStore.Error(err)
      // );
    }
    const request = new _DeleteStoreRequest();
    request.setStoreName(name);
    this.logger.debug(`Deleting store: ${name}`);
    return await new Promise<DeleteStore.Response>((resolve, reject) => {
      this.clientWrapper.deleteStore(
        request,
        this.clientMetadataProvider.createClientMetadata(),
        (err, _resp) => {
          if (err) {
            return resolve(new DeleteStore.Error(err as unknown as SdkError));
          } else {
            resolve(new DeleteStore.Success());
          }
        }
      );
    });
  }

  public async listStores(): Promise<ListStores.Response> {
    const request = new _ListStoresRequest();
    request.setNextToken('');
    this.logger.debug("Issuing 'listStores' request");
    return await new Promise<ListStores.Response>((resolve, reject) => {
      this.clientWrapper.listStores(
        request,
        this.clientMetadataProvider.createClientMetadata(),
        (err, resp) => {
          if (err) {
            return resolve(new ListStores.Error(err as unknown as SdkError));
          } else {
            const stores = resp.getStoreList().map(store => {
              const storeName = store.getStoreName();
              return new StoreInfo(storeName);
            });
            resolve(new ListStores.Success(stores));
          }
        }
      );
    });
  }
}
