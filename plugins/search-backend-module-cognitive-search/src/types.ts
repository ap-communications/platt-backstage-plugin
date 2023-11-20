import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { SearchField } from '@azure/search-documents';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';

export type CognitiveSearchLogger = Logger | LoggerService;

export type CognitiveSearchIndexFields = SearchField[];

export type DefaultBackstageSearchDocuments = CatalogEntityDocument | TechDocsDocument;

export type CognitiveSearchIndexTransformer<T extends DefaultBackstageSearchDocuments> = (data: T) => T;
export type CognitiveSearchIndexOption<T  extends DefaultBackstageSearchDocuments> = {
  type: string;
  transformer?: CognitiveSearchIndexTransformer<T>;
  fields: CognitiveSearchIndexFields;
}

export type CognitiveSearchSearchEngineOption<T  extends DefaultBackstageSearchDocuments> = {
  config: Config;
  type: string;
  defaultAnalyzerName?: string;
  indexDefinitions?: CognitiveSearchIndexOption<T>[];
  logger: CognitiveSearchLogger
};

export type CognitiveSearchSearchEngineIndexerOption<T  extends DefaultBackstageSearchDocuments> = CognitiveSearchSearchEngineOption<T> & {
  batchSize?: number;
};

export type CognitiveSearchDocument<T extends DefaultBackstageSearchDocuments> = {
  type: string;
  key: string;
  document: T;
};

