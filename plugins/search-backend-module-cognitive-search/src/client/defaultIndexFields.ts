import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import {
  CognitiveSearchIndexFields,
  CognitiveSearchIndexTransformer,
  DefaultBackstageSearchDocuments
} from '../types';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';

// see: IndexabuleDocument at https://github.com/backstage/backstage/blob/master/plugins/search-common/src/types.ts
export const defaultIndexableFields = (analyzerName: string): CognitiveSearchIndexFields => ([
  {
    type: 'Edm.String',
    name: 'title',
    searchable: true,
    filterable: false,
    sortable: false,
    analyzerName: analyzerName,
  },
  {
    type: 'Edm.String',
    name: 'text',
    searchable: true,
    filterable: false,
    sortable: false,
    analyzerName: analyzerName,
  },
  {
    type: 'Edm.String',
    name: 'location',
    searchable: true,
    filterable: true,
    sortable: true,
  },
  {
    type: 'Edm.ComplexType',
    name: 'authorization',
    fields: [
      {
        type: 'Edm.String',
        name: 'resourceRef',
        searchable: false,
        filterable: true,
        sortable: false,
      }
    ]
  }
]);

export const indexableDocumentTransformer = <T extends DefaultBackstageSearchDocuments>(data: T): IndexableDocument => {
  return {
    title: data.title,
    text: data.text,
    location: data.location,
    authorization: data.authorization,
  };
};

// see: CatalogEntityDocument at https://github.com/backstage/backstage/blob/master/plugins/catalog-common/src/search/CatalogEntityDocument.ts
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

export const entityIndexTransformer: CognitiveSearchIndexTransformer<CatalogEntityDocument> = (entity) => {
  return {
    ...indexableDocumentTransformer(entity),
    componentType: entity.componentType,
    type: entity.type,
    namespace: entity.namespace,
    kind: entity.kind,
    lifecycle: entity.lifecycle,
    owner: entity.owner,
  };
};

// DefaultCatalogCollatorFactory.type
// @see https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-catalog/src/collators/DefaultCatalogCollatorFactory.ts
export const entityIndexerType = 'software-catalog';

// see: TechDocsDocument at  https://github.com/backstage/backstage/blob/master/plugins/techdocs-node/src/techdocsTypes.ts
export const techDocsIndexFields = (_analyzerName: string): CognitiveSearchIndexFields => ([
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
    name: 'namespace',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: true,
  },
  {
    type: 'Edm.String',
    name: 'name',
    searchable: true,
    facetable: true,
    filterable: true,
    sortable: true,
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
    sortable: true,
  },
  {
    type: 'Edm.String',
    name: 'path',
    searchable: true,
    facetable: false,
    filterable: false,
    sortable: false,
  },
]);

export const techDocsIndexTransformer: CognitiveSearchIndexTransformer<TechDocsDocument> = (data: TechDocsDocument): TechDocsDocument => {
  return {
    ...indexableDocumentTransformer(data),
    kind: data.kind,
    namespace: data.namespace,
    name: data.name,
    lifecycle: data.lifecycle,
    owner: data.owner,
    path: data.path,
  };
};

// DefaultTechDocsCollatorFactory.type
// @see https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-techdocs/src/collators/DefaultTechDocsCollatorFactory.ts
export const techDocsIndexerType = 'techdocs';