import { rootHttpRouterServiceFactory } from '@backstage/backend-app-api';
import cookieParser from 'cookie-parser';
import { authMiddlewareFactory } from './middlewares';

export default rootHttpRouterServiceFactory ({
  configure: ({ app, config, logger, middleware, routes }) => {
    app.use(middleware.helmet());
    app.use(middleware.cors());
    app.use(middleware.compression());
    app.use(cookieParser());
    app.use(middleware.logging());

    app.use(authMiddlewareFactory({ config, logger }));

    // Simple handler to set auth cookie for user
    app.use('/api/cookie', (_, res) => {
      res.status(200).send();
    });

    app.use(routes);

    app.use(middleware.notFound());
    app.use(middleware.error());
  },
});