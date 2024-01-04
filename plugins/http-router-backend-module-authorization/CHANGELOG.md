# @platt/plugin-authorization-extension-node

## 2.0.0

### Major Changes

- ce04738: Change package name from @platt/plugin-authorization-extension-node to @platt/plugin-http-router-backend-module-authorization

  - rename packaga
  - reduce cookie token size
  - add interface for new backend system

## 1.1.0

### Minor Changes

- 202a291: Bump backstage from v1.20.2 to v1.21.1

## 1.0.1

### Patch Changes

- 4b8e344: update several basement dependencies

## 1.0.0

### Major Changes

- 8f8973b: To avoid evil-doers from accessing backstage data/contents,
  'authorization-extension' plugins are provided the checking mechanism
  using authorization header with a Backstage identity token.
  This plugins code are copied from https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md
