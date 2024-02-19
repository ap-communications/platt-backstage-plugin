# @platt/plugin-search-backend-module-cognitive-search

## 1.5.1

### Patch Changes

- d61605f: Bump @azure/identity from 4.0.0 to 4.0.1

## 1.5.0

### Minor Changes

- 152de66: bump backstage from v1.21.1 to v1.22.1

## 1.4.0

### Minor Changes

- 202a291: Bump backstage from v1.20.2 to v1.21.1

## 1.3.2

### Patch Changes

- faddf57: update several basement dependencies

## 1.3.1

### Patch Changes

- afb485b: Bug fix: It could not be added additional document type to index #59
- c7071de: bugfix use techDocs index transformer for techdocs

## 1.3.0

### Minor Changes

- 4dcd7a8: Ensure the document shcemas for storing in cognitive-search

  breaking change.
  Cognitive search is not able to accept unknown properties of the document. To ensure document will be matched as schema entirely, I added `CognitiveSearchIndexTransformer`.
  Please read the document(README.md) of plugin if you added additional document types.

- fb34fcc: bump backstage from v1.19.5 to v1.20.2

### Patch Changes

- e77b975: bump @azure/identity from 3.3.0 to 3.4.1
- 553c268: bump @azure/identity to 4.0.0 and @azure/search-documents to 12.0.0

## 1.2.0

### Minor Changes

- 9225f47: bump up backstage version to 1.19.5

### Patch Changes

- 8870d5b: Bump @azure/search-documents from 11.3.2 to 11.3.3

## 1.1.0

### Minor Changes

- e3cf002: bump backstage to 1.18.1

### Patch Changes

- 8258eee: Bump uuid from 9.0.0 to 9.0.1
- abe1696: Bump @types/uuid from 9.0.3 to 9.0.4
- 1d65efa: Bump @types/uuid from 9.0.3 to 9.0.4
- cac3491: Bump uuid from 9.0.0 to 9.0.1
