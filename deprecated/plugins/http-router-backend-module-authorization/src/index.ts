/***/
/**
 * Node.js library for the authorize-backend plugin.
 *
 * @packageDocumentation
 */

import middlewareModule from './module';

export {
  authMiddlewareFactory,
  createAuthMiddleware
} from './middlewares';
export * from './services';
export default middlewareModule;
