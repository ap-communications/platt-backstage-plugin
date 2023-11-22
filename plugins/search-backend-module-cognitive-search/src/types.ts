import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { SearchField } from '@azure/search-documents';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';
import { IndexableDocument } from '@backstage/plugin-search-common';

export type CognitiveSearchLogger = Logger | LoggerService;

export type CognitiveSearchIndexFields = SearchField[];

export type DefaultBackstageSearchDocuments = CatalogEntityDocument | TechDocsDocument;

export type CognitiveSearchIndexTransformer<T> = (data: any) => T;
export type CognitiveSearchIndexOption<T extends IndexableDocument> = {
  type: string;
  transformer?: CognitiveSearchIndexTransformer<T>;
  fields: CognitiveSearchIndexFields;
}

export type CognitiveSearchSearchEngineOption<T extends IndexableDocument> = {
  config: Config;
  type: string;
  defaultAnalyzerName?: string;
  indexDefinitions?: CognitiveSearchIndexOption<T>[];
  logger: CognitiveSearchLogger
};

export type CognitiveSearchSearchEngineIndexerOption<T extends IndexableDocument> = CognitiveSearchSearchEngineOption<T> & {
  batchSize?: number;
};

export type CognitiveSearchDocument<T extends IndexableDocument> = {
  type: string;
  key: string;
  document: T;
};

