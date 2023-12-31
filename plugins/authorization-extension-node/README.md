# @platt/plugin-authorization-extension-node

This plugin is copied from "[Authanticate API requests](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md)".

Currently we only tested on old backend system.

As you can see "[Authanticate API requests](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md)",
The Backstage backend APIs are available without authentication by defaultl,
For example, you can access the api endpoint of tech docs contents without authentication.

This library provide feature to avoid unauthorized access, 

## How to use it on Old Backend system

### Setup backend

Install plugin and related modules to backend.

```
yarn add --cwd packages/backend @platt/plugin-authorization-extension-node
yarn add --cwd packages/backend cookie-parser
yarn add --cwd packages/backend --dev @types/cookie-parser

```

Update routes in packages/backend/src/index.ts

```typescript
// packages/backend/src/index.ts from a create-app deployment

import { createAuthMiddleware, setCookieService } from '@platt/plugin-authorization-extension-node';
import cookieParser from 'cookie-parser';

// ...

async function main() {
  // ...

  const authMiddleware = await createAuthMiddleware(config, appEnv);

  const apiRouter = Router();
  apiRouter.use(cookieParser());
  // The auth route must be publicly available as it is used during login
  apiRouter.use('/auth', await auth(authEnv));
  // Add a simple endpoint to be used when setting a token cookie
  apiRouter.use('/cookie', authMiddleware, setCookieService);
  // Only authenticated requests are allowed to the routes below
  apiRouter.use('/catalog', authMiddleware, await catalog(catalogEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/proxy', authMiddleware, await proxy(proxyEnv));
  apiRouter.use(authMiddleware, notFoundHandler());

  // ...
}
```

### Setup frontend

Install frontend library plugin

```
yarn add --cwd packages/app @platt/plugin-authorization-extension-react

```


Configure packages/app/src/App.tsx

```tsx
// packages/app/src/App.tsx from a create-app deployment

import type { IdentityApi } from '@backstage/core-plugin-api';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { setTokenCookie } from '@platt/plugin-authorization-extension-react';

// ...

const app = createApp({
  // ...

  components: {
    SignInPage: props => {
      const discoveryApi = useApi(discoveryApiRef);
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
          onSignInSuccess={async (identityApi: IdentityApi) => {
            setTokenCookie(
              await discoveryApi.getBaseUrl('cookie'),
              identityApi,
            );

            props.onSignInSuccess(identityApi);
          }}
        />
      );
    },
  },

  // ...
});

// ...
```
