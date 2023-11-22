import { Config } from '@backstage/config';
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexClient } from '../client';
import {
  CognitiveSearchIndexOption,
  CognitiveSearchLogger,
  CognitiveSearchSearchEngineIndexerOption,
  DefaultBackstageSearchDocuments
} from '../types';
import { IndexableDocument } from '@backstage/plugin-search-common';

const DEFAULT_BATCH_SIZE = 1000;

export class CognitiveSearchSearchEngineIndexer<T extends IndexableDocument = DefaultBackstageSearchDocuments> extends BatchSearchEngineIndexer {
  private readonly config: Config;
  private readonly type: string;
  private readonly logger: CognitiveSearchLogger;
  private readonly searchIndexDefinitions?: CognitiveSearchIndexOption<T>[];
  private client?: IndexClient<T>

  constructor(private options: CognitiveSearchSearchEngineIndexerOption<T>) {
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
    try {
      this.logger.debug(`Indexing ${documents.length} documents`);
      return this.getIndexClient().upsertDocuments(this.type, documents);
    } catch (err) {
      this.logger.warn(`Failed to index documents ${err}`)
      throw err;
    }
  }

  async initialize(): Promise<void> {
    try {
      this.logger.debug('Initializing search engine indexer');
      await this.getIndexClient().setupIndex(this.searchIndexDefinitions);  
    } catch (err) {
      this.logger.warn(`Failed to initialize search engine indexer ${err}`);
      throw err;
    }
  }

  finalize(): Promise<void> {
    this.logger.debug('Finalizing search engine indexer');
    return Promise.resolve();
  }
}
