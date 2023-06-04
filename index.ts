import { setupTsConfigPaths } from './tsconfig-pulumi-fix';

setupTsConfigPaths();

import { restApi } from '@infrastructure/restapi';

export const url = restApi.url;
