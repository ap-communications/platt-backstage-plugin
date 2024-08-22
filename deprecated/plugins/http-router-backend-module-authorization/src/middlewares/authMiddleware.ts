import type { Config } from '@backstage/config';
import lzstring from 'lz-string';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { TokenManager } from '@backstage/backend-common';
import { Response, RequestHandler } from 'express';
import { decodeJwt } from 'jose';
import { URL } from 'url';
import { Logger } from 'winston';
import { LoggerService } from '@backstage/backend-plugin-api';

// @see https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md

const setTokenCookie = (
  res: Response,
  options: {
    token: string;
    secure: boolean,
    cookieDomain: string
  }
) => {
  try {
    const payload = decodeJwt(options.token);
    res.cookie('token', options.token, {
      encode: lzstring.compressToEncodedURIComponent,
      expires: new Date(payload.exp ? payload.exp * 1000 : 0),
      secure: options.secure,
      sameSite: 'lax',
      domain: options.cookieDomain,
      path: '/',
      httpOnly: true,
    });
  } catch(_err) {
    // ignore
  }
};

export type MiddlewarePluginEnvirontment = {
  identity: IdentityApi;
  logger: Logger | LoggerService;
  tokenManager: TokenManager;
}

export const createAuthMiddleware = (
  config: Config,
  appEnv: MiddlewarePluginEnvirontment
) => {
  const baseUrl = config.getString('backend.baseUrl');
  const secure = baseUrl.startsWith('https://');
  const cookieDomain = new URL(baseUrl).hostname;
  const authMiddleware: RequestHandler = async (req, res, next) => {
    try {
      // Token cookies are compressed to reduce size
      const cookieToken = lzstring.decompressFromEncodedURIComponent(
        req.cookies.token,
      );      
      const token = getBearerTokenFromAuthorizationHeader(req.headers.authorization)
        ?? cookieToken;
      if (!token) {
        appEnv.logger.info(`No token found in request ${req.url} ${req.method}`);
        res.status(401).json({message: 'unauthorized' });
        return;
      }
      try {
        // check user access token
        req.user = await appEnv.identity.getIdentity({ request: req });
      } catch {
        // check server to server token
        await appEnv.tokenManager.authenticate(token);
      }
      if (!req.headers.authorization) {
        // Authorization header may be forwarded by plugin requests
        req.headers.authorization = `Bearer ${token}`;
      }
      if (token && token !== req.cookies?.token) {
        setTokenCookie(res, { token, secure, cookieDomain });
      }
      next();
    }
    catch {
      appEnv.logger.info(`Invalid token found in request. ${req.url} ${req.method}`);
      res.status(401).json({ message: 'unauthorized' });
    }
  };
  return authMiddleware;
};
