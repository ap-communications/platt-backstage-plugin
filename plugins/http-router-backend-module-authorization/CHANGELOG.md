# @platt/plugin-authorization-extension-node

## 2.4.0

### Minor Changes

- 1eb27d3: Bump backstage from v1.24.2 to v1.25.0

## 2.3.0

### Minor Changes

- ebd39cc: Just bump backstage from v1.23.0 to v1.24.2

### Patch Changes

- ac9f468: Bump express from 4.18.3 to 4.19.2
- 212e70c: Bump jose from 5.2.2 to 5.2.3

## 2.2.0

### Minor Changes

- 659e786: Bump backstage from v1.22.1 to v1.23.0

## 2.1.1

### Patch Changes

- 220caa4: bump jose from 5.1.3 to 5.2.2

## 2.1.0

### Minor Changes

- 152de66: bump backstage from v1.21.1 to v1.22.1

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
