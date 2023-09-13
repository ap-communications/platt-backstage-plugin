import { v4 as uuid } from 'uuid';
import { SearchOptions } from '@azure/search-documents';
import { Config } from '@backstage/config';
import {
  IndexableDocument,
  IndexableResultSet,
  Result,
  SearchEngine,
  SearchQuery
} from '@backstage/plugin-search-common';
import {
  CognitiveSearchDocument,
  CognitiveSearchIndexFields,
  CognitiveSearchLogger,
  DefaultBackstageSearchDocuments
} from '../types';
import { SearchClient } from '../client';
import { CognitiveSearchSearchEngineIndexer } from './CognitiveSearchSearchEngineIndexer';

export type CongnitiveSearchConcreateQuery<T extends IndexableDocument> = {
  keyword: string;
  options?: SearchOptions<keyof CognitiveSearchDocument<T>>;
}

export type CognitiveSearchQueryTransltor<T extends IndexableDocument> = (
  query: SearchQuery,
  options?: CognitiveSearchQueryTranslatorOption
) => CongnitiveSearchConcreateQuery<T>;

type CognitiveSearchQueryTranslatorOption = {
  useHighlight: boolean;
  preTag: string;
  postTag: string;
}

const DEFAULT_PAGE_SIZE = 25;

export const encodePageCursor = (position: number): string => {
  const actualPosition = position > 0 ? position : 0;
  return Buffer.from(`${actualPosition}`).toString('base64');
}
export const decodePageCursor = (cursor?: string): number => cursor
  ? Number(Buffer.from(cursor, 'base64').toString('utf-8'))
  : 0;

export class CognitiveSearchSearchEngine<T extends IndexableDocument = DefaultBackstageSearchDocuments> implements SearchEngine {
  private logger: CognitiveSearchLogger;
  private client?: SearchClient<T>;
  private searchIndexDefinitions?: CognitiveSearchIndexFields[];
  private readonly translatorOption: CognitiveSearchQueryTranslatorOption;
  private defaultAnalyzerName?: string;

  private constructor(private options: {
    config: Config;
    logger: CognitiveSearchLogger;
    searchIndexDefinitions?: CognitiveSearchIndexFields[];
    defaultAnalyzerName?: string;
  }) {
    this.logger = options.logger;
    this.searchIndexDefinitions = options.searchIndexDefinitions;
    this.defaultAnalyzerName = options.defaultAnalyzerName;

    const uuidTag = uuid();
    this.translatorOption = {
      preTag: `<${uuidTag}>`,
      postTag: `</${uuidTag}>`,
      useHighlight: options.config.getOptionalBoolean('search.cognitiveSearch.highlightOptions.useHighlight') ?? true,
    }
  }

  protected getSearchClient() {
    if (!this.client) {
      this.client = SearchClient.fromConfig<T>(this.options.config, { logger: this.logger });
    }
    return this.client;

  }

  getIndexer(type: string) {
    const indexerLogger = this.logger.child({ documentType: type});

    return Promise.resolve(new CognitiveSearchSearchEngineIndexer<T>({
      config: this.options.config,
      type,
      defaultAnalyzerName: this.defaultAnalyzerName,
      indexDefinitions: this.searchIndexDefinitions,
      logger: indexerLogger,
    }));
  }

  setTranslator(translator: CognitiveSearchQueryTransltor<T>): void {
    this.translator = translator;
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { keyword, options: searchOptions } = this.translator(query, this.translatorOption);
    const searchResults = await this.getSearchClient().search(keyword, searchOptions);
    const numberOfResults = searchResults.count || 0;
    const results: Result<T>[]  = [];

    const page = decodePageCursor(query.pageCursor);
    let rankIndex: number = 1;
    for await (const result of searchResults.results) {
      results.push({
        type: result.document.type,
        document: result.document.document,
        highlight: {
          preTag: this.translatorOption.preTag,
          postTag: this.translatorOption.postTag,
          fields: Object.fromEntries(
            Object.entries(result.highlights || {}).map(([field, fragments]) => [
              field.replace('document/', ''),
              fragments.join('...'),
            ]),
          ),
        },
        // rank 1 is the top priority
        rank: page * (searchOptions?.top ?? DEFAULT_PAGE_SIZE) + rankIndex++,
      });
    }
    
    const hasNextPage = numberOfResults > ((searchOptions?.skip || 0) + (searchOptions?.top || 0));
    return {
      results,
      nextPageCursor: hasNextPage ? encodePageCursor(page + 1) : undefined,
      previousPageCursor: (page > 0) ? encodePageCursor(page - 1) : undefined,
      numberOfResults
    };
  }

  static fromConfig<T extends IndexableDocument = DefaultBackstageSearchDocuments>(config: Config, options: {
    logger: CognitiveSearchLogger;
    searchIndexDefinitions?: CognitiveSearchIndexFields[];
    defaultAnalyzerName?: string;
    translator?: CognitiveSearchQueryTransltor<T>;
  }): CognitiveSearchSearchEngine<T> {
    const engine = new CognitiveSearchSearchEngine<T>({
      config: config,
      logger: options.logger,
      searchIndexDefinitions: options.searchIndexDefinitions,
      defaultAnalyzerName: options.defaultAnalyzerName,
    });

    if (options.translator) {
      engine.setTranslator(options.translator);
    }

    return engine;
  }

  protected translator(
    query: SearchQuery,
    options?: CognitiveSearchQueryTranslatorOption  // TODO consider options
  ): CongnitiveSearchConcreateQuery<T> {
    const { term, filters = {}, types } = query;

    const tyepsFilter = ((types?.length || 0) > 0) 
    ? `search.in(type, '${types?.join(',')}', ',')`
    : undefined;

    const queryFilters = Object.entries(filters)
      .filter(([_, value]) => Boolean(value))
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `search.in(document/${key}, '${value.join(',')}', ',')`;
        }
        if (['number', 'boolean'].includes(typeof value)) {
          return `document/${key} eq ${value}`
        } else if (['string'].includes(typeof value)) {
          return `document/${key} eq '${value}'`
        }

        this.logger.error('Fail to query, unrecognized filter type', { key, value });
        throw new Error('Fail to query, unrecognized filter type');
      });

    const highestOptions = options?.useHighlight ? {
      highlightFields: 'document/title,document/text',
      highlightPreTag: options?.preTag,
      highlightPostTag: options?.postTag,
    } : {}

    const pageSize = query.pageLimit || DEFAULT_PAGE_SIZE;
    const page = decodePageCursor(query.pageCursor);

    return {
      keyword: term || '',
      options: {
        includeTotalCount: true,
        facets: ['type'],
        top: pageSize,
        skip: page * pageSize,
        filter: [tyepsFilter, ...queryFilters].filter(Boolean).join(' and ') || undefined,
        ...highestOptions
      }
    };
  }

  static supported(config: Config) {
    return !!config.getOptionalString('search.cognitiveSearch.endpoint');
  }
}
