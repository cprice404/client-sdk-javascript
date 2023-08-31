import {IVectorIndexDataClient} from '@gomomento/sdk-core/dist/src/internal/clients/vector/IVectorIndexDataClient';
import {VectorIndexItem} from '@gomomento/sdk-core/dist/src/messages/vector-index';
import {
  CredentialProvider,
  InvalidArgumentError,
  MomentoLogger,
  SearchOptions,
  VectorAddItemBatch,
  VectorDeleteItemBatch,
  VectorSearch,
} from '@gomomento/sdk-core';
import {VectorIndexClientProps} from '../vector-index-client-props';
import {VectorIndexConfiguration} from '../config/vector-index-configuration';

export class VectorDataClient implements IVectorIndexDataClient {
  private readonly configuration: VectorIndexConfiguration;
  private readonly credentialProvider: CredentialProvider;
  private readonly logger: MomentoLogger;
  private readonly requestTimeoutMs: number;

  constructor(props: VectorIndexClientProps) {
    this.configuration = props.configuration;
    this.credentialProvider = props.credentialProvider;
    this.logger = this.configuration.getLoggerFactory().getLogger(this);
    const grpcConfig = this.configuration
      .getTransportStrategy()
      .getGrpcConfig();

    this.requestTimeoutMs = grpcConfig.getDeadlineMillis();
    this.validateRequestTimeout(this.requestTimeoutMs);
    this.logger.debug(
      `Creating vector index client using endpoint: '${this.credentialProvider.getVectorEndpoint()}'`
    );
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

  private validateRequestTimeout(timeout?: number) {
    this.logger.debug(`Request timeout ms: ${String(timeout)}`);
    if (timeout && timeout <= 0) {
      throw new InvalidArgumentError(
        'request timeout must be greater than zero.'
      );
    }
  }
}
