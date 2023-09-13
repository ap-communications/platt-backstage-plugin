import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { SearchField } from '@azure/search-documents';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';

export type CognitiveSearchLogger = Logger | LoggerService;

export type CognitiveSearchIndexFields = SearchField[];

export type CognitiveSearchSearchEngineOption = {
  config: Config;
  type: string;
  defaultAnalyzerName?: string;
  indexDefinitions?: CognitiveSearchIndexFields[];
  logger: CognitiveSearchLogger
};

export type CognitiveSearchSearchEngineIndexerOption = CognitiveSearchSearchEngineOption & {
  batchSize?: number;
};

export type CognitiveSearchDocument<T extends IndexableDocument> = {
  type: string;
  key: string;
  document: T;
};

export type DefaultBackstageSearchDocuments = CatalogEntityDocument | TechDocsDocument;
