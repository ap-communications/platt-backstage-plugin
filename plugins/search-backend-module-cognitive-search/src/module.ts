import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { CognitiveSearchSearchEngine } from './engines';

export default createBackendModule({
  pluginId: 'search',
  moduleId: 'cognitive-search',
  register(env) {
    env.registerInit({
      deps: {
        searchEngineRegistry: searchEngineRegistryExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async init({ searchEngineRegistry, config, logger }) {
        searchEngineRegistry.setSearchEngine(
          CognitiveSearchSearchEngine.fromConfig(config, {
            logger
          })
        );
      },
    });

  }
});
