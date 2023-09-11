import { CognitiveSearchIndexFields } from '../types';

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
