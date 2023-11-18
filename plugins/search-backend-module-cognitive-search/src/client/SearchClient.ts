import { Config } from '@backstage/config';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { SearchOptions } from '@azure/search-documents';
import {
  AzureCredentailOption,
  CognitiveSearchClient,
  IndexClientOption
} from './CognitiveSearchClient';
import { CognitiveSearchDocument, CognitiveSearchLogger } from '../types';

export class SearchClient<T extends IndexableDocument> extends CognitiveSearchClient<T> {
  private constructor(
    logger: CognitiveSearchLogger,
    indexOption: IndexClientOption,
    credentialOption?: AzureCredentailOption
  ) {
    super(logger, indexOption, credentialOption);
  }

  static fromConfig<T extends IndexableDocument>(
    c: Config,
    option: {
      logger: CognitiveSearchLogger;
    }
  ) {
    const searchOption = this.getIndexClientOption(c);
    const credentialOption = this.getAzureCredentailOption(c);

    return new SearchClient<T>(option.logger, searchOption, credentialOption);
  }

  async search(keyword: string, options?: SearchOptions<CognitiveSearchDocument<T>>) {
    this.logger.debug(`Searching keyword: ${keyword}`);
    return this.getSearchClient().search(keyword, options);
  }
}
