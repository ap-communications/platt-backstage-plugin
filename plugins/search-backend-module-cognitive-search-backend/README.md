# search-backend-module-cognitive-search

This is an extension to module to [search-backend-node](https://github.com/backstage/backstage/tree/master/plugins/search-backend-node) plugin.
This module provides functionality to index and implement querying using [Azure Cognitive Search](https://learn.microsoft.com/en-us/azure/search/).

## Getting Started

- provision cognitive search
- assign roles to user or service principal
- implements search plugns

### Provision a Azure Cognitive Search service

Following the [Azure Cognitive Search document](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search), you can create an Azure Cognitive Search service using azure portal(or bicep or any other tools).

### Assign roles to user or service principal

This plugin is uses [DefaultAzureCredential](https://www.npmjs.com/package/@azure/identity) of @azure/identity for authorizing access to Azure Cognitive Search service. So you can use user identity or service principal.

It is needed to assigned [roles](https://learn.microsoft.com/en-us/azure/search/search-security-rbac?tabs=config-svc-portal%2Croles-portal%2Ctest-portal%2Ccustom-role-portal%2Cdisable-keys-portal#built-in-roles-used-in-search) below to user or principal.


- [Search Service Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#search-service-contributor) for creating the indexes.
- [Search Index Data Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#search-index-data-contributor) for read/write the index contents.

## Install & configure earch plugin

### Install plugin

Install the plugin to backstage backend.

```bash
yarn add --cwd packages/backend @platt/plugin-search-backend-module-cognitive-search-backend

```

### Configure setting

To enable this plugin, at least you should configure `search.cognitiveSearch.endpoint`.

Other optional configuration can be found in the [config.d.ts](./config.d.ts). 

```yaml
search:
  cognitiveSearch:
    endpoint: https://<your service name>.search.windows.net

```

### 

Here is the sample code for using Cognitive Search plugin.

```typescript
import { CognitiveSearchSearchEngine } from '@platt/plugin-search-backend-module-cognitive-search-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const searchEngine = (CognitiveSearchSearchEngine.supported(env.config))
  ? CognitiveSearchSearchEngine.fromConfig(env.config, {
      logger: env.logger,
      defaultAnalyzerName: 'ja.microsoft',
    })
  : new LunrSearchEngine({ logger: env.logger });
  
  const indexBuilder = new IndexBuilder({
    logger: env.logger,
    searchEngine,
  });

```

You can define `defaultAnalyzerName` for cognitive search indexes.
For example, our catalog or techdocs is written by Japanese, so we'd like to use 
'ja.microsoft' analyzer.

`defaultAnalyzerName` can be specifies the [supported language analyzers](https://learn.microsoft.com/en-us/azure/search/index-add-language-analyzers#supported-language-analyzers) of cognitive search.



## Indexable document

### Supported document by default

This plugin supports basic backstage document below

- [Catalog entity document](https://github.com/backstage/backstage/blob/master/plugins/catalog-common/src/search/CatalogEntityDocument.ts)
- [TechDocs document](https://github.com/backstage/backstage/blob/master/plugins/techdocs-node/src/techdocsTypes.ts)

### Additonal document type (Optional)
If you want to use other document, you should define the schema of document and adding document type.

You shoud map the json types of document to the [index schemas](https://learn.microsoft.com/en-us/azure/search/search-what-is-an-index).


Here is the sample schema definition. (for of the catalog entity).

```typescript
export const catalogEntityIndexFields = (_analyzerName: string): CognitiveSearchIndexFields => ([
  {
    type: 'Edm.String',
    name: 'componentType',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
  {
    type: 'Edm.String',
    name: 'type',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
  {
    type: 'Edm.String',
    name: 'namespace',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
  {
    type: 'Edm.String',
    name: 'kind',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
  {
    type: 'Edm.String',
    name: 'lifecycle',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
  {
    type: 'Edm.String',
    name: 'owner',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: false,
  },
]);

```

You can find the full definitions [here](./src/client/defaultIndexFields.ts) for default document types.

And here is the sample code for supporting additional type.

```typescript

// add 2 types of additional documents
const extraSchema1: CognitiveSearchIndexFields = [
  ...
];
const extraSchema2: CognitiveSearchIndexFields = [
  ...
];

const ExtendedDocumentType = SomeDocument | DefaultBackstageSearchDocuments;

CognitiveSearchSearchEngine.fromConfig<ExtendedDocumentType>(env.config, {
      logger: env.logger,
      defaultAnalyzerName: 'ja.microsoft',
      searchIndexDefinitions: [ extraSchema1, extraSchema2 ],
    })
```

Extra schemas will be merged to default schemas applied automatically.


```typescript
const ExtendedDocumentType = SomeDocument | DefaultBackstageSearchDocuments;
```

Here is the type definition of document types, and it will be applied through the type generis of fromConfig function.


## License

Copyright 2023 AP Communications Co.,Ltd. Licenced under the [Apache Licence, Version 2.0](../../LICENSE).