# @platt/plugin-authorization-extension-node

## 1.0.1

### Patch Changes

- 4b8e344: update several basement dependencies

## 1.0.0

### Major Changes

- 8f8973b: To avoid evil-doers from accessing backstage data/contents,
  'authorization-extension' plugins are provided the checking mechanism
  using authorization header with a Backstage identity token.
  This plugins code are copied from https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md
