import { register, loadConfig } from 'tsconfig-paths';

/**
 * This function will read the tsconfig.json file and register the paths
 * defined in there. This is needed because Pulumi does not support
 * tsconfig.json paths option.
 * */
export const setupTsConfigPaths = () => {
  const tsConfig = loadConfig('.');
  if (tsConfig.resultType === 'failed') {
    console.log('Could not load tsconfig to map paths, aborting.');
    process.exit(1);
  }
  register({
    baseUrl: tsConfig.absoluteBaseUrl,
    paths: tsConfig.paths,
  });
};
