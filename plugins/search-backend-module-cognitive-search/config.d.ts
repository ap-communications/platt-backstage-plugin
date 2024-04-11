export interface Config {
  search?: {
    cognitiveSearch?: {
      /**
       * Azure cognitive search endpoint
       * @visibility backend
       */
      endpoint: string;
      /**
       * Cognintive search index name
       * @visibility backend
       */
      indexName?: string;
      /**
       * Cognintive search default analyzer name
       * You can find the list of available analyzers in https://learn.microsoft.com/en-us/azure/search/index-add-language-analyzers#supported-language-analyzers
       * default is en.lucene
       * @visibility backend
       */
      defaultAnalyzerName?: string;
      /**
       * Highlight options for cognitive search
       * @visibility backend
       */
      highlightOptions?: {
        /**
         * whether to use highlight or not
         * @visibility backend
         */
        useHighlight?: boolean;
      }
      /**
       * Azure tenant id for application registration
       * if you use managed identity, you don't need to configure tenantId/clientId/clientSecret.
       * @visibility backend
       */
      tenantId?: string;
      /**
       * Azure client id for application registration
       * @visibility backend
       */
      clientId?: string;
      /**
       * Azure client secret for application registration
       * @visibility secret
       */
      clientSecret?: string;
    }
  }
}
