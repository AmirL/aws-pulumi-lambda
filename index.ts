import { setupTsConfigPaths } from './tsconfig-pulumi-fix';

setupTsConfigPaths();

export { endpoint } from '@infrastructure/http-api';
