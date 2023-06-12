import { setupTsConfigPaths } from './tsconfig-pulumi-fix';
setupTsConfigPaths();

import * as pulumi from '@pulumi/pulumi';
import { apiGateway } from '@infrastructure/api-gateway';
import { stage } from '@infrastructure/api-routes';

export const stageUrl = pulumi.interpolate`${apiGateway.apiEndpoint}/${stage.name}`;
