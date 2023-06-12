import * as pulumi from '@pulumi/pulumi';

/**
 * Returns a name with the stack name prefixed.
 */
export function n(name: string) {
  return `${pulumi.getStack()}-${name}`;
}
