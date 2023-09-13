import { Config } from '@backstage/config';
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { IndexClient } from '../client';
import {
  CognitiveSearchIndexFields,
  CognitiveSearchLogger,
  CognitiveSearchSearchEngineIndexerOption,
  DefaultBackstageSearchDocuments
} from '../types';

const DEFAULT_BATCH_SIZE = 1000;

export class CognitiveSearchSearchEngineIndexer<T extends IndexableDocument = DefaultBackstageSearchDocuments> extends BatchSearchEngineIndexer {
  private readonly config: Config;
  private readonly type: string;
  private readonly logger: CognitiveSearchLogger;
  private readonly searchIndexDefinitions?: CognitiveSearchIndexFields[];
  private client?: IndexClient<T>

  constructor(private options: CognitiveSearchSearchEngineIndexerOption) {
    super({ batchSize: options.batchSize || DEFAULT_BATCH_SIZE });
    this.config = options.config;
    this.type = options.type;
    this.logger = options.logger.child({ documentType: options.type });
    this.searchIndexDefinitions = options.indexDefinitions;
  }

  getIndexClient() {
    if (!this.client) {
      this.client = IndexClient.fromConfig<T>(this.config, {
        logger: this.logger,
        analyzerName: this.options.defaultAnalyzerName
      });  
    }
    return this.client;
  }

  index(documents: T[]): Promise<void> {
    return this.getIndexClient().upsertDocuments(this.type, documents);
  }

  async initialize(): Promise<void> {
    await this.getIndexClient().setupIndex(this.searchIndexDefinitions);
  }

  finalize(): Promise<void> {
    return Promise.resolve();
  }
}
