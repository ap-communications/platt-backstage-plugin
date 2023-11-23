import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity';
import { SearchClient } from '@azure/search-documents';
import { Config } from '@backstage/config';
import {
  CognitiveSearchDocument,
  CognitiveSearchLogger,
} from '../types';
import { IndexableDocument } from '@backstage/plugin-search-common';

export interface AzureCredentailOption {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export interface IndexClientOption {
  endpoint: string;
  indexName: string;
}

const DEFAULT_INDEX_NAME = 'backstage-index';

export abstract class CognitiveSearchClient<T extends IndexableDocument> {
  private client?: SearchClient<CognitiveSearchDocument<T>>;
  protected readonly credential: ClientSecretCredential | DefaultAzureCredential;

  constructor(protected logger: CognitiveSearchLogger, protected indexOption: IndexClientOption, credentialOption?: AzureCredentailOption) {
    this.credential = credentialOption
        ? new ClientSecretCredential(credentialOption.tenantId, credentialOption.clientId, credentialOption.clientSecret)
        : new DefaultAzureCredential();
  }

  protected static  getIndexClientOption(c: Config): IndexClientOption {
    const config = c.getConfig('search.cognitiveSearch');
    return {
      endpoint: config.getString('endpoint'),
      indexName: config.getOptionalString('indexName') || DEFAULT_INDEX_NAME
    };
  }
  
  protected static getAzureCredentailOption(c: Config): AzureCredentailOption | undefined {
    const config = c.getConfig('search.cognitiveSearch');
    if (!config.getOptionalString('clientId')) {
      return undefined;
    }
    return {
      tenantId: config.getString('tenantId'),
      clientId: config.getString('clientId'),
      clientSecret: config.getString('clientSecret')
    };
  }

  protected getSearchClient() {
    if (!this.client) {
      this.client = new SearchClient<CognitiveSearchDocument<T>>(
        this.indexOption.endpoint,
        this.indexOption.indexName || DEFAULT_INDEX_NAME,
        this.credential
      );
    }
    this.logger.info(`search client for index [${this.client.indexName}]`);
    return this.client;
  }
}
