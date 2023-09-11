import crypto from 'crypto';
import PQueue from 'p-queue';
import { Config } from '@backstage/config';
import {
  KnownAnalyzerNames,
  SearchField,
  SearchIndex,
  SearchIndexClient,
  SearchIndexingBufferedSender
} from '@azure/search-documents';
import { IndexableDocument } from '@backstage/plugin-search-common';
import {
  CognitiveSearchDocument,
  CognitiveSearchIndexFields,
  CognitiveSearchLogger
} from '../types';
import {
  AzureCredentailOption,
  CognitiveSearchClient,
  IndexClientOption
} from './CognitiveSearchClient';
import {
  catalogEntityIndexFields,
  defaultIndexableFields,
  techDocsIndexFields
} from './defaultIndexFields';

const generateHash = (type: string, location: string) => crypto.createHash('sha256').update(`${type}:${location}`).digest('hex');
const generateEtag = (o: string) => crypto.createHash('sha256').update(o).digest('hex');

export class IndexClient<T extends IndexableDocument> extends CognitiveSearchClient<T> {
  private indexClient?: SearchIndexClient;
  private static queue: PQueue = new PQueue({ concurrency: 1 });

  private constructor(
    logger: CognitiveSearchLogger,
    indexOption: IndexClientOption,
    private readonly analyzerName: string,
    credentialOption?: AzureCredentailOption
  ) {
    super(logger, indexOption, credentialOption);
  }

  static fromConfig<T extends IndexableDocument>(
    c: Config,
    option: {
      logger: CognitiveSearchLogger;
      analyzerName?: string;
    }
  ) {
    const searchOption = this.getIndexClientOption(c);
    const credentialOption = this.getAzureCredentailOption(c);

    return new IndexClient<T>(option.logger, searchOption, option.analyzerName || KnownAnalyzerNames.EnLucene, credentialOption);
  }

  async setupIndex(definitions?: CognitiveSearchIndexFields[]) {
    return new Promise<void>((resolve, reject) => {
      IndexClient.queue.add(async () => {
        await this.upsertIndex(definitions)
        .then(() => resolve())
        .catch((e) => reject(e))
      });
    });
  }

  mergeSearchFieldDefinitions(definitions: CognitiveSearchIndexFields[]) {
    const allDefinitions: CognitiveSearchIndexFields = [
      ...defaultIndexableFields(this.analyzerName),
      ...catalogEntityIndexFields(this.analyzerName),
      ...techDocsIndexFields(this.analyzerName),
      ...definitions.flat()
    ];
    return Array.from(new Map(allDefinitions.map(item => [item.name, item])).values());
  }

  protected async upsertIndex(definitions?: CognitiveSearchIndexFields[]) {
    const fields = this.mergeSearchFieldDefinitions(definitions || []);
    const searchField: SearchField[] = [
      {
        type: 'Edm.String',
        name: 'type',
        searchable: true,
        filterable: true,
        sortable: true,
        facetable: true,
      },
      {
        type: 'Edm.String',
        name: 'key',
        searchable: true,
        filterable: true,
        sortable: true,
        key: true,
      },
      {
        type: 'Edm.ComplexType',
        name: 'document',
        fields,
      },
    ];
    const index: SearchIndex = {
      name: this.indexOption.indexName,
      fields: searchField,
      etag: generateEtag(JSON.stringify(searchField)),
    };
    this.logger.info(`Creating index [${this.indexOption.indexName}] in ${this.indexOption.endpoint}`);
    const createdIndex = await this.getIndexClient().createOrUpdateIndex(index);
    this.logger.info(`Cognitive Search Index [${createdIndex.name}] created`);
  }

  protected getIndexClient() {
    if (!this.indexClient) {
      this.indexClient = new SearchIndexClient(this.indexOption.endpoint, this.credential);
    }
    return this.indexClient;
  }

  async upsertDocuments(type: string, documents: T[]) {
    this.logger.info(`Upserting ${documents?.length || 0} documents to ${this.indexOption.indexName}`);

    const bufferedClient = new SearchIndexingBufferedSender<CognitiveSearchDocument<T>>(
      this.getSearchClient(),
      (searchDoc) => searchDoc.key,
      {
        autoFlush: true,
      }
    );

    try {  
      await bufferedClient.uploadDocuments(documents.map(document => ({
        type,
        key: generateHash(type, document.location),
        document
      })));
      await bufferedClient.flush();
    } catch(e) {
      throw e;
    } finally {
      await bufferedClient.dispose();
    }
  }
}
