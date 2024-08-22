import { HostDiscovery } from '@backstage/backend-app-api';
import { ServerTokenManager } from '@backstage/backend-common';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { createAuthMiddleware } from './authMiddleware';

type AuthMiddlewareFactoryOptions = {
  config: RootConfigService;
  logger: LoggerService;
};

export const authMiddlewareFactory = ({
  config,
  logger,
}: AuthMiddlewareFactoryOptions): RequestHandler => {
  const discovery = HostDiscovery.fromConfig(config);
  const identity = DefaultIdentityClient.create({ discovery });
  const tokenManager = ServerTokenManager.fromConfig(config, { logger });
  const authMiddleware = createAuthMiddleware(config, {
    identity,
    logger,
    tokenManager,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    const fullPath = `${req.baseUrl}${req.path}`;
  
    // Only apply auth to /api routes & skip auth for the following endpoints
    // Add any additional plugin routes you want to whitelist eg. events
    const nonAuthWhitelist = ['app', 'auth'];
    const nonAuthRegex = new RegExp(
      `^\/api\/(${nonAuthWhitelist.join('|')})(?=\/|$)\S*`,
    );
    if (!fullPath.startsWith('/api/') || nonAuthRegex.test(fullPath)) {
      next();
      return;
    }
    authMiddleware(req, res, next);
  };
};
